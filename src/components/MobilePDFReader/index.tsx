import * as React from "react";
import * as CSSModules from "react-css-modules";
import * as styles from "./index.less";
import * as pdfjsLib from "pdfjs-dist";
import { debug } from "util";
const pdfjsViewer = require("../../../node_modules/pdfjs-dist/web/pdf_viewer.js");

// default scale
const DEFAULT_MIN_SCALE = 0.25;
const DEFAULT_MAX_SCALE = 10.0;
let USE_ONLY_CSS_ZOOM = true;
let TEXT_LAYER_MODE = 0; // DISABLE
let MAX_IMAGE_SIZE = 1024 * 1024;
let CMAP_PACKED = true;
let DEFAULT_URL = "/test.pdf";
let DEFAULT_SCALE_DELTA  = 1.1;
let MIN_SCALE = DEFAULT_MIN_SCALE;
let MAX_SCALE = DEFAULT_MAX_SCALE;
let DEFAULT_SCALE_VALUE: string|number = "auto"; // in order to be responsive
interface IProps {
  url: string|object;
  page?: number|string;
  scale?: number|string;
  onDocumentComplete?: any;
  minScale?: number;
  maxScale?: number;
  isShowHeader?:boolean;
  isShowFooter?:boolean;
  workerSrc?: string;
  progressColor?: string;
  isShowProgress?: string;
  documentBackground?: string;
  progress?: string;
}
interface IStates {
  currentPageNumber: any;
  currentScaleValue: any;
  totalPage: number|string;
  title: string;
}
@CSSModules(styles)
export class MobilePDFReader extends React.Component<IProps,IStates> {
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
  public constructor (props: IProps) {
    super(props);
    this.pdfLoadingTask = null;
    this.pdfDocument = null;
    this.element = null;
    this.pdfViewer = {
      currentScaleValue: null
    },
    this.pdfHistory = null;
    this.pdfLinkService = null;
    this.container = React.createRef();
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = props.workerSrc || "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js";
  }
  get pagesCount () {
    return this.pdfDocument.numPages;
  }
  get page () {
    if (this.pdfViewer != null) {
      return this.pdfViewer.currentPageNumber;
    } else {
      return 1;
    }
  }
  get loadingBar () {
    let bar = new pdfjsViewer.ProgressBar("#loadingBar", {});
    return pdfjsLib.shadow(this, "loadingBar", bar);
  }
  private open (params) {
    let url = params.url
    let self = this
    const { onDocumentComplete } = this.props;
    this.setTitleUsingUrl(url)
    // Loading document.
    let loadingTask = pdfjsLib.getDocument({
      url: url,
      withCredentials: true,
      maxImageSize: MAX_IMAGE_SIZE,
      cMapPacked: CMAP_PACKED
    })
    this.pdfLoadingTask = loadingTask

    loadingTask.onProgress = function (progressData) {
      self.progress(progressData.loaded / progressData.total)
    }

    return loadingTask.promise.then(function (pdfDocument) {
      // Document loaded, specifying document for the viewer.
      self.pdfDocument = pdfDocument;
      self.pdfViewer.setDocument(pdfDocument)
      self.pdfLinkService.setDocument(pdfDocument)
      self.pdfHistory.initialize(pdfDocument.fingerprint)
      self.setTitleUsingMetadata(pdfDocument)
      onDocumentComplete && onDocumentComplete();
    }, function (exception) {
      let message = exception && exception.message
      let l10n = self.l10n
      let loadingErrorMessage

      if (exception instanceof pdfjsLib.InvalidPDFException) {
        // change error message also for other builds
        loadingErrorMessage = l10n.get('invalid_file_error', null,
          'Invalid or corrupted PDF file.')
      } else if (exception instanceof pdfjsLib.MissingPDFException) {
        // special message for missing PDFs
        loadingErrorMessage = l10n.get('missing_file_error', null,
          'Missing PDF file.')
      } else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
        loadingErrorMessage = l10n.get('unexpected_response_error', null,
          'Unexpected server response.')
      } else {
        loadingErrorMessage = l10n.get('loading_error', null,
          'An error occurred while loading the PDF.')
      }

      loadingErrorMessage.then(function (msg) {
        console.log(msg)
      })
      self.loadingBar.hide()
    })
  }
  private setTitleUsingUrl (url) {
    let title = pdfjsLib.getFilenameFromUrl(url) || url;
    try {
      title = decodeURIComponent(title);
    } catch (e) {
      // decodeURIComponent may throw URIError,
      // fall back to using the unprocessed url in that case
    }
    this.setTitle(title);
  }
  private setTitleUsingMetadata (pdfDocument) {
    let self = this ;
    return pdfDocument.getMetadata().then(function (data) {
      let info = data.info; let metadata = data.metadata;
      self.documentInfo = info ;
      self.metadata = metadata;

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
        self.setTitle(pdfTitle + " - " + document.title);
      }
      return {title: pdfTitle, documentInfo: info};
    });
  }
  private setTitle (title) {
    this.setState({title});
  }
  private progress (level) {
      const { onDocumentComplete } = this.props;
    let percent = Math.round(level * 100);
    // Updating the bar if value increases.
    if (percent > this.loadingBar.percent || isNaN(percent)) {
      this.loadingBar.percent = percent;
    }

    if (this.loadingBar.percent === 100) {
        this.element = document.querySelector('#viewer.pdfViewer');
        setTimeout(()=> {
            this.loadingBar.hide();
            this.computedContentHeight();
        }, 200)
    }

  }
  private initUI () {
    let linkService = new pdfjsViewer.PDFLinkService();
    const self = this;
    const { scale, page, onDocumentComplete } = self.props;
    this.pdfLinkService = linkService;

    this.l10n = pdfjsViewer.NullL10n;

    let container = this.container.current;
    let pdfViewer = new pdfjsViewer.PDFViewer({
      container: container,
      linkService: linkService,
      l10n: this.l10n,
      useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
      textLayerMode: TEXT_LAYER_MODE
    });
    this.pdfViewer = pdfViewer;
    linkService.setViewer(pdfViewer);

    this.pdfHistory = new pdfjsViewer.PDFHistory({
      linkService: linkService
    });
    linkService.setHistory(this.pdfHistory);
    container.addEventListener("pagesinit", function () {
      // We can use pdfViewer now, e.g. let's change default scale.
      // deal with the init page in the props
      if (scale) {
        DEFAULT_SCALE_VALUE = scale;
      }
      if (page) {
        pdfViewer.currentPageNumber = page;
      }
      pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
      self.setState({totalPage: self.pdfDocument.numPages});
    });
    container.addEventListener("pagechange", function (evt) {
      let page = evt.pageNumber;
      self.setState({ currentPageNumber: page });
    });
  }
  private computedContentHeight() {
      const children = this.element.children;
      if (children && children[0]) {
          this.element.style.height = `${children[0].clientHeight * children.length + 20}px`;
      }
  }
  private zoomIn = (ticks) => {
    let newScale = this.pdfViewer.currentScale;
    do {
      newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.ceil(newScale * 10) / 10;
      newScale = Math.min(MAX_SCALE, newScale);
    } while (--ticks && newScale < MAX_SCALE);
    this.pdfViewer.currentScaleValue = newScale;
    this.computedContentHeight();
  }
  private zoomOut = (ticks) => {
    let newScale = this.pdfViewer.currentScale;
    do {
      newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.floor(newScale * 10) / 10;
      newScale = Math.max(MIN_SCALE, newScale);
    } while (--ticks && newScale > MIN_SCALE);
    this.pdfViewer.currentScaleValue = newScale;
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
  public componentDidMount () {
    const { url, minScale, maxScale} = this.props ;
    // deal with the props if include minScale or maxScale
    if (minScale) {
      MIN_SCALE = minScale ;
    }
    if (maxScale) {
      MAX_SCALE = maxScale ;
    }
    this.initUI();
    this.open({
      url
    });
  }
  public render(){
    const { title, currentPageNumber, totalPage } = this.state;
    const { isShowHeader,isShowFooter, progressColor, isShowProgress, documentBackground, progress = '文件加载中, 请稍后.'  } = this.props;
    const width = `${ 100 * Number(currentPageNumber) / Number(totalPage) }vw`;
    const style = {};

    if (documentBackground) {
        style['background'] = documentBackground;
    }

    const progressStyle = {
      width
    };
    let showHeader = true;
    let showFooter = true;
    if(isShowHeader!==undefined){
      showHeader = isShowHeader;
    }
    if(isShowFooter!==undefined){
      showFooter = isShowFooter;
    }

    if (progressColor) {
      progressStyle['background'] = progressColor;
    }

    return <div className='mobile__pdf__container' style={style}>
              {
                showHeader&&<header className="mobile__pdf__container__header">
                   {title}
                </header>
              }
              <div id="viewerContainer" ref={this.container}>
                <div id="viewer" className="pdfViewer" ></div>
              </div>
              {this.state.totalPage && isShowProgress ? <div className='viewer-progress' style={progressStyle}></div> : null}
              <div id="loadingBar">
                <div className="progress"></div>
                <div className="glimmer"></div>
              </div>
              <div id="errorWrapper" hidden={true}>
                <div id="errorMessageLeft">
                  <span id="errorMessage"></span>
                  <button id="errorShowMore">
                     More Information
                  </button>
                  <button id="errorShowLess">
                     Less Information
                  </button>
                </div>
                <div id="errorMessageRight">
                  <button id="errorClose">
                     Close
                  </button>
                </div>
                <div className="clearBoth"></div>
                <textarea id="errorMoreInfo" hidden={true} readOnly={true}></textarea>
              </div>
              <footer>
                <div>
                  <button className="toolbarButton zoomIn" title="Zoom In" id="zoomIn" onClick={this.zoomIn}></button>
                  <button className="toolbarButton zoomOut" title="Zoom Out" id="zoomOut" onClick={this.zoomOut}></button>
                </div>
                <div className='toolbar-page'>
                  {this.state.totalPage ? <div id='pageNumber'>{currentPageNumber} / { totalPage }</div> : null}
                </div>
             </footer>

          </div>
  }
}