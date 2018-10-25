import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, filter, forEach } from 'lodash';
// import JSZip from 'jszip';
import saveAs from 'file-saver';


import {
  initCanvas,
  dataURItoBlob,
  wordWrap,
} from './lib/walletRenderer';

import {
  drawQR,
  drawSigil,
  drawText,
  drawWrappedText,
  loadQR,
  loadSigil,
} from './lib/draw';


class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.pcr_ref = React.createRef();
    this.canvas = null;
    this.state = {
      renderedCollateral: null,
    };
  };


  componentDidMount = () => {
    this.canvas = initCanvas(this.pcr_ref, { x: 612, y: 792 }, 300/72);
    this.drawLayout(this.props.renderableLayout);
  };


  drawLayout = (renderableLayout) => {

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#000";

    const asynchronous = filter(renderableLayout.renderables, renderable => {
      return renderable.type === 'SIGIL' || renderable.type === 'QR';
    });

    const synchronous = filter(renderableLayout.renderables, renderable => {
      return renderable.type === 'TEXT';
    });

    const loadThese = map(asynchronous, item => {
      if (item.type === 'QR') return loadQR({ ctx, ...item });
      if (item.type === 'SIGIL') return loadSigil({ ctx, ...item });
    });

    Promise.all(loadThese).then((loadedItems) => {
      forEach([...loadedItems, ...synchronous], item => {
        if (item.type === 'QR') return drawQR({ ctx, ...item });
        if (item.type === 'SIGIL') return drawSigil({ ctx, ...item });
        if (item.type === 'TEXT') return drawWrappedText({ ctx, ...item });
      });

      const result = {
        layout: renderableLayout,
        png: dataURItoBlob(this.canvas.toDataURL("image/png")),
      };

      this.props.callback(result);
    });
  };


  render() {
    return (
      <div className={'flex flex-column'}>
        <canvas ref={ pcr_ref => this.pcr_ref = pcr_ref } />
      </div>

    );
  };
};

export default PaperCollateralRenderer;
