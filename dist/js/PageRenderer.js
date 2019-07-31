const _jsxFileName = "/Users/gavinatkinson/Tlon/PaperCollateralRenderer/src/js/PageRenderer.js";import React, { Component } from 'react';
import { get } from 'lodash';

// import {
//   initCanvas,
//   dataURItoBlob,
//   wordWrap,
// } from './lib/utils';
//
// import {
//   drawSigil,
//   drawQR,
//   drawImg,
//   drawText,
//   drawWrappedText,
//   drawEthereumAddressCompact,
//   drawEthereumAddressLong,
//   drawPatQ,
//   drawRect,
//   drawLine,
// } from './lib/draw';


class PageRenderer extends Component {
  constructor(props) {
    super(props);PageRenderer.prototype.__init.call(this);PageRenderer.prototype.__init2.call(this);
    // this.pcr_ref = React.createRef();
    // this.canvas = null;
    // this.state = {
    // };
  }


  __init() {this.componentDidMount = () => {
    this.canvas = initCanvas(this.pcr_ref, { x: 612, y: 792 }, 4);
    const results = this.props.pages.map(page => this.drawLayout(page));
    this.props.callback(results);
  }}

  __init2() {this.drawLayout = (page) => {

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#000";

    page.renderables.forEach(r => {
      if (r.type === 'qr') return drawQR({ ctx, ...r });
      if (r.type === 'patq') return drawPatQ({ ctx, ...r });
      if (r.type === 'img') return drawImg({ ctx, ...r });
      if (r.type === 'addr_split_four') return drawEthereumAddressLong({ ctx, ...r });
      if (r.type === 'wrap_addr_split_four') return drawEthereumAddressCompact({ ctx, ...r });
      if (r.type === 'sigil') return drawSigil({ ctx, ...r });
      if (r.type === 'rect') return drawRect({ ctx, ...r });
      if (r.type === 'hr') return drawLine({ ctx, ...r });
      if (r.type === 'template_text') return drawWrappedText({ ctx, ...r });
      if (r.type === 'text') return drawWrappedText({ ctx, ...r });
    });

    const pageWithImageData = {
      ship: page.ship,
      collateralType: page.collateralType,
      bin: page.bin,
      page: get(page, 'page', '1'),
      pageTitle: page.pageTitle,
      png: dataURItoBlob(this.canvas.toDataURL("image/png")),
      durl: this.canvas.toDataURL("image/png"),
    };
    return pageWithImageData;
  }}


  render() {
    return (
      React.createElement('div', { className: 'flex flex-column', __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
        , React.createElement('canvas', { ref:  pcr_ref => this.pcr_ref = pcr_ref , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} )
      )

    );
  };
};

export default PageRenderer;
