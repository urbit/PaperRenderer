import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, filter, forEach, get } from 'lodash';

import {
  initCanvas,
  dataURItoBlob,
  wordWrap,
} from './lib/utils';

import {
  drawQR,
  drawSigil,
  drawText,
  drawWrappedText,
  drawEthereumAddressCompact,
  drawEthereumAddressLong,
  drawPatQ,
} from './lib/draw';


class PageRenderer extends Component {
  constructor(props) {
    super(props)
    this.pcr_ref = React.createRef();
    this.canvas = null;
    this.state = {
    };
  };


  componentDidMount = () => {
    this.canvas = initCanvas(this.pcr_ref, { x: 612, y: 792 }, 10);
    this.drawLayout(this.props.page);
  };


  drawLayout = (page) => {

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#000";

    forEach(page.renderables, r => {
      if (r.type === 'QR') return drawQR({ ctx, ...r });
      if (r.type === 'PATQ') return drawPatQ({ ctx, ...r });
      if (r.type === 'ADDR_LONG') return drawEthereumAddressLong({ ctx, ...r });
      if (r.type === 'ADDR_COMPACT') return drawEthereumAddressCompact({ ctx, ...r });
      if (r.type === 'SIGIL') return drawSigil({ ctx, ...r });
      if (r.type === 'TEXT') return drawWrappedText({ ctx, ...r });
    });

    const pageWithImageData = {
      ship: page.ship,
      collateralType: page.collateralType,
      bin: page.bin,
      page: get(page, 'page', '1'),
      png: dataURItoBlob(this.canvas.toDataURL("image/png")),
    };

    this.props.callback(pageWithImageData);
  };


  render() {
    return (
      <div className={'flex flex-column'}>
        <canvas ref={ pcr_ref => this.pcr_ref = pcr_ref } />
      </div>

    );
  };
};

export default PageRenderer;
