import * as React from "react";
import * as CSSModules from "react-css-modules";
import * as styles from "./index.less";
import * as pdfjsLib from "pdfjs-dist";
const pdfjsViewer = require("../../../node_modules/pdfjs-dist/web/pdf_viewer.js");

// default scale
const DEFAULT_MIN_SCALE = 0.25;
const DEFAULT_MAX_SCALE = 10.0;
let USE_ONLY_CSS_ZOOM = true;
let TEXT_LAYER_MODE = 0; // DISABLE
let MAX_IMAGE_SIZE = 1024 * 1024;
let CMAP_PACKED = true;
let DEFAULT_URL = "/test.pdf";
let DEFAULT_SCALE_DELTA = 1.1;
let MIN_SCALE = DEFAULT_MIN_SCALE;
let MAX_SCALE = DEFAULT_MAX_SCALE;
const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
let DEFAULT_SCALE_VALUE: string | number = "page-width"; // in order to be responsive

interface IProps {
    url: string | object;
    page?: number | string;
    scale?: number | string;
    onDocumentComplete?: any;
    minScale?: number;
    maxScale?: number;
    isShowHeader?: boolean;
    isShowFooter?: boolean;
    workerSrc?: string;
    progressColor?: string;
    isShowProgress?: string;
    documentBackground?: string;
    progress?: string;
    textLayerMode?: boolean;
    hideBarTime?: number;
    renderer?: string;
}
interface IStates {
    currentPageNumber: any;
    currentScaleValue: any;
    totalPage: number | string;
    title: string;
}
@CSSModules(styles)
export class MobilePDFReader extends React.PureComponent<IProps, IStates> {
    state: IStates = {
        currentPageNumber: 1,
        currentScaleValue: "auto",
        totalPage: null,
        title: "",
    };

    pdfLoadingTask: any;
    pdfViewer: any;
    pdfDocument: any;
    pdfHistory: any;
    pdfLinkService: any;
    container: any;
    l10n: any;
    error: any;
    documentInfo: any;
    metadata: any;
    element: any;
    pagechange: any;
    pagesinit: any;

    public constructor(props: IProps) {
        super(props);
        this.pdfLoadingTask = null;
        this.pdfDocument = null;
        this.element = null;
        this.pdfViewer = {
            currentScaleValue: null,
        };
        this.pdfHistory = null;
        this.pdfLinkService = null;
        this.pagesinit = null;
        this.pagechange = null;
        this.container = React.createRef();
        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            // props.workerSrc || "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js";
            props.workerSrc || "http://172.16.0.2:8101/vendors~pdfjsWorker.app.js";
    }

    get pagesCount() {
        return this.pdfDocument.numPages;
    }

    get page() {
        if (this.pdfViewer != null) {
            return this.pdfViewer.currentPageNumber;
        } else {
            return 1;
        }
    }

    get loadingBar() {
        let bar = new pdfjsViewer.ProgressBar("#loadingBar", {});
        return pdfjsLib.shadow(this, "loadingBar", bar);
    }

    private open(params) {
        const { url } = params;
        const { onDocumentComplete } = this.props;
        this.setTitleUsingUrl(url);
        // Loading document.
        let loadingTask = pdfjsLib.getDocument({
            url,
            withCredentials: true,
            maxImageSize: MAX_IMAGE_SIZE,
            cMapPacked: CMAP_PACKED,
            // cMapUrl: CMAP_URL,
        });
        this.pdfLoadingTask = loadingTask;

        loadingTask.onProgress = progressData => {
            this.progress(progressData.loaded / progressData.total);
        };

        return loadingTask.promise.then(
            pdfDocument => {
                // Document loaded, specifying document for the viewer.
                this.pdfDocument = pdfDocument;
                this.pdfViewer.setDocument(pdfDocument);
                this.pdfLinkService.setDocument(pdfDocument);
                this.pdfHistory.initialize(pdfDocument.fingerprint);
                this.setTitleUsingMetadata(pdfDocument);
                onDocumentComplete && onDocumentComplete();
            },
            exception => {
                let message = exception && exception.message;
                let l10n = this.l10n;
                let loadingErrorMessage;

                if (exception instanceof pdfjsLib.InvalidPDFException) {
                    // change error message also for other builds
                    loadingErrorMessage = l10n.get("invalid_file_error", null, "Invalid or corrupted PDF file.");
                } else if (exception instanceof pdfjsLib.MissingPDFException) {
                    // special message for missing PDFs
                    loadingErrorMessage = l10n.get("missing_file_error", null, "Missing PDF file.");
                } else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
                    loadingErrorMessage = l10n.get("unexpected_response_error", null, "Unexpected server response.");
                } else {
                    loadingErrorMessage = l10n.get("loading_error", null, "An error occurred while loading the PDF.");
                }

                loadingErrorMessage.then(msg => {
                    console.log(msg);
                });
                this.loadingBar.hide();
            }
        );
    }

    private setTitleUsingUrl(url) {
        let title = pdfjsLib.getFilenameFromUrl(url) || url;
        try {
            title = decodeURIComponent(title);
        } catch (e) {
            // decodeURIComponent may throw URIError,
            // fall back to using the unprocessed url in that case
        }
        this.setTitle(title);
    }

    private setTitleUsingMetadata(pdfDocument) {
        return pdfDocument.getMetadata().then(data => {
            let { info, metadata } = data;
            this.documentInfo = info;
            this.metadata = metadata;

            // Provides some basic debug information
            // console.log("PDF " + pdfDocument.fingerprint + " [" +
            //             info.PDFFormatVersion + " " + (info.Producer || "-").trim() +
            //             " / " + (info.Creator || "-").trim() + "]" +
            //             " (PDF.js: " + (pdfjsLib.version || "-") + ")");

            let pdfTitle;
            if (metadata && metadata.has("dc:title")) {
                let title = metadata.get("dc:title");
                // Ghostscript sometimes returns 'Untitled', so prevent setting the
                // title to 'Untitled.
                if (title !== "Untitled") {
                    pdfTitle = title;
                }
            }

            if (!pdfTitle && info && info["Title"]) {
                pdfTitle = info["Title"];
            }

            if (pdfTitle) {
                this.setTitle(pdfTitle + " - " + document.title);
            }
            return { title: pdfTitle, documentInfo: info };
        });
    }

    private setTitle(title) {
        this.setState({ title });
    }

    private progress(level) {
        const { onDocumentComplete, hideBarTime = 1000 } = this.props;
        let percent = Math.round(level * 100);
        // Updating the bar if value increases.
        if (percent > this.loadingBar.percent || isNaN(percent)) {
            this.loadingBar.percent = percent;
        }

        // TODO 解决某些情况下服务器 没有返回 content-lenth 时不能正确关闭 loading bar 的问题
        if (this.loadingBar.percent === 100 || (percent === 100 && level === 1)) {
            this.element = document.querySelector("#viewer.pdfViewer");
            setTimeout(() => {
                this.computedContentHeight();
                this.loadingBar.hide();
            }, hideBarTime);
        }
    }

    private initUI() {
        const {
            scale = DEFAULT_SCALE_VALUE,
            page = 1,
            onDocumentComplete,
            textLayerMode = TEXT_LAYER_MODE,
            renderer = "canvas",
        } = this.props;
        const linkService = new pdfjsViewer.PDFLinkService();

        this.pdfLinkService = linkService;
        this.l10n = pdfjsViewer.NullL10n;

        let container = this.container.current;
        let pdfViewer = new pdfjsViewer.PDFViewer({
            container,
            linkService,
            l10n: this.l10n,
            renderer,
            useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
            textLayerMode,
        });
        this.pdfViewer = pdfViewer;
        linkService.setViewer(pdfViewer);

        this.pdfHistory = new pdfjsViewer.PDFHistory({
            linkService: linkService,
        });
        linkService.setHistory(this.pdfHistory);

        this.pagesinit = () => {
            // We can use pdfViewer now, e.g. let's change default scale.
            // deal with the init page in the props
            pdfViewer.currentScaleValue = scale;
            pdfViewer.currentPageNumber = page;
            this.setState({ totalPage: this.pdfDocument.numPages });
        };

        this.pagechange = evt => {
            let page = evt.pageNumber;
            this.setState({ currentPageNumber: page });
        };

        container.addEventListener("pagesinit", this.pagesinit);
        container.addEventListener("pagechange", this.pagechange);
    }

    private computedContentHeight() {
        const children = this.element.children;
        if (children && children[0]) {
            this.element.style.height = `${children[0].clientHeight * children.length + 20}px`;
        }
    }

    private zoomIn = ticks => {
        let newScale = this.pdfViewer.currentScale;
        do {
            newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.ceil(newScale * 10) / 10;
            newScale = Math.min(MAX_SCALE, newScale);
        } while (--ticks && newScale < MAX_SCALE);
        this.pdfViewer.currentScaleValue = newScale;
        this.computedContentHeight();
    }

    private zoomOut = ticks => {
        let newScale = this.pdfViewer.currentScale;
        do {
            newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.floor(newScale * 10) / 10;
            newScale = Math.max(MIN_SCALE, newScale);
        } while (--ticks && newScale > MIN_SCALE);
        this.pdfViewer.currentScaleValue = newScale;
        this.computedContentHeight();
    }

    private zoomReset = ticks => {
        this.pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
        this.computedContentHeight();
    }

    private pageAdd = () => {
        if (this.pdfViewer.currentPageNumber > this.pdfDocument.numPages) {
            return;
        }
        this.pdfViewer.currentPageNumber++;
    }

    private pageDelete = () => {
        if (this.pdfViewer.currentPageNumber < 1) {
            return;
        }
        this.pdfViewer.currentPageNumber--;
    }

    public componentDidMount() {
        const { url, minScale, maxScale } = this.props;
        // deal with the props if include minScale or maxScale
        if (minScale) {
            MIN_SCALE = minScale;
        }
        if (maxScale) {
            MAX_SCALE = maxScale;
        }
        this.initUI();
        this.open({
            url,
        });
    }

    public componentWillUnmount() {
        this.pdfLoadingTask.destroy();
        this.container.removeEventListener("pagesinit", this.pagesinit);
        this.container.removeEventListener("pagechange", this.pagechange);
    }

    public render() {
        const { title, currentPageNumber, totalPage } = this.state;
        const {
            isShowHeader,
            isShowFooter,
            progressColor,
            isShowProgress,
            documentBackground,
            progress = "文件加载中, 请稍后.",
        } = this.props;
        const width = `${(100 * Number(currentPageNumber)) / Number(totalPage)}vw`;
        const style = {};

        if (documentBackground) {
            style["background"] = documentBackground;
        }

        const progressStyle = {
            width,
        };
        let showHeader = true;
        let showFooter = true;
        if (isShowHeader !== undefined) {
            showHeader = isShowHeader;
        }
        if (isShowFooter !== undefined) {
            showFooter = isShowFooter;
        }

        if (progressColor) {
            progressStyle["background"] = progressColor;
        }

        return (
            <div className="mobile__pdf__container" style={style}>
                {showHeader && <header className="mobile__pdf__container__header">{title}</header>}
                <div id="viewerContainer" ref={this.container}>
                    <div id="viewer" className="pdfViewer" />
                </div>
                {this.state.totalPage && isShowProgress ? (
                    <div className="viewer-progress" style={progressStyle} />
                ) : null}
                <div id="loadingBar">
                    <div className="progress" />
                    <div className="glimmer" />
                </div>
                <div id="errorWrapper" hidden={true}>
                    <div id="errorMessageLeft">
                        <span id="errorMessage" />
                        <button id="errorShowMore">More Information</button>
                        <button id="errorShowLess">Less Information</button>
                    </div>
                    <div id="errorMessageRight">
                        <button id="errorClose">Close</button>
                    </div>
                    <div className="clearBoth" />
                    <textarea id="errorMoreInfo" hidden={true} readOnly={true} />
                </div>
                <footer>
                    <div>
                        <button className="toolbarButton zoomIn" title="Zoom In" id="zoomIn" onClick={this.zoomIn} />
                        <button
                            className="toolbarButton zoomOut"
                            title="Zoom Out"
                            id="zoomOut"
                            onClick={this.zoomOut}
                        />
                        <button
                            className="toolbarButton zoomReset"
                            title="Zoom Reset"
                            id="zoomReset"
                            onClick={this.zoomReset}
                        />
                    </div>
                    <div className="toolbar-page">
                        {this.state.totalPage ? (
                            <div id="pageNumber">
                                {currentPageNumber} / {totalPage}
                            </div>
                        ) : null}
                    </div>
                </footer>
            </div>
        );
    }
}
