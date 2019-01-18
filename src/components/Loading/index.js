import React from 'react';

const LOADING = {
    bounce: (
        <div className="spinner bounce">
            <div className="bounce1" />
            <div className="bounce2" />
            <div className="bounce3" />
        </div>
    ),
    rect: (
        <div className="spinner rect">
            <div className="rect1" />
            <div className="rect2" />
            <div className="rect3" />
            <div className="rect4" />
            <div className="rect5" />
        </div>
    ),
    circle: (
        <div className="circle sk-circle">
            <div className="sk-circle1 sk-child" />
            <div className="sk-circle2 sk-child" />
            <div className="sk-circle3 sk-child" />
            <div className="sk-circle4 sk-child" />
            <div className="sk-circle5 sk-child" />
            <div className="sk-circle6 sk-child" />
            <div className="sk-circle7 sk-child" />
            <div className="sk-circle8 sk-child" />
            <div className="sk-circle9 sk-child" />
            <div className="sk-circle10 sk-child" />
            <div className="sk-circle11 sk-child" />
            <div className="sk-circle12 sk-child" />
        </div>
    ),
    cube: (
        <div className="cube sk-cube-grid">
            <div className="sk-cube sk-cube1" />
            <div className="sk-cube sk-cube2" />
            <div className="sk-cube sk-cube3" />
            <div className="sk-cube sk-cube4" />
            <div className="sk-cube sk-cube5" />
            <div className="sk-cube sk-cube6" />
            <div className="sk-cube sk-cube7" />
            <div className="sk-cube sk-cube8" />
            <div className="sk-cube sk-cube9" />
        </div>
    ),
    fadingCircle: (
        <div className="fading-circle sk-fading-circle">
            <div className="sk-circle1 sk-circle" />
            <div className="sk-circle2 sk-circle" />
            <div className="sk-circle3 sk-circle" />
            <div className="sk-circle4 sk-circle" />
            <div className="sk-circle5 sk-circle" />
            <div className="sk-circle6 sk-circle" />
            <div className="sk-circle7 sk-circle" />
            <div className="sk-circle8 sk-circle" />
            <div className="sk-circle9 sk-circle" />
            <div className="sk-circle10 sk-circle" />
            <div className="sk-circle11 sk-circle" />
            <div className="sk-circle12 sk-circle" />
        </div>
    ),
    foldingCube: (
        <div className="folding-cube sk-folding-cube">
            <div className="sk-cube1 sk-cube" />
            <div className="sk-cube2 sk-cube" />
            <div className="sk-cube4 sk-cube" />
            <div className="sk-cube3 sk-cube" />
        </div>
    ),
};

const Loading = ({ type = 'foldingCube' }) => {
    return <div className="component-loading">{LOADING[type]}</div>;
};

export { Loading };
