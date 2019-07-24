import React, { Component } from 'react';
import { get } from 'lodash';

import {
  initCanvas,
  dataURItoBlob,
  wordWrap,
} from './lib/utils';

import {
  drawSigil,
  drawQR,
  drawImg,
  drawText,
  drawWrappedText,
  drawEthereumAddressCompact,
  drawEthereumAddressLong,
  drawPatQ,
  drawRect,
  drawLine,
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
    this.canvas = initCanvas(this.pcr_ref, { x: 612, y: 792 }, 4);
    const results = this.props.pages.map(page => this.drawLayout(page));
    this.props.callback(results);
  };

  drawLayout = (page) => {

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#000";

    page.renderables.forEach(r => {
      if (r.type === 'QR') return drawQR({ ctx, ...r });
      if (r.type === 'PATQ') return drawPatQ({ ctx, ...r });
      if (r.type === 'IMG') return drawImg({ ctx, ...r }); 
      if (r.type === 'ADDR_SPLIT_FOUR') return drawEthereumAddressLong({ ctx, ...r });
      if (r.type === 'WRAP_ADDR_SPLIT_FOUR') return drawEthereumAddressCompact({ ctx, ...r });
      if (r.type === 'ADDR_COMPACT') return drawEthereumAddressCompact({ ctx, ...r });
      if (r.type === 'SIGIL') return drawSigil({ ctx, ...r });
      if (r.type === 'RECT') return drawRect({ ctx, ...r });
      if (r.type === 'HR') return drawLine({ ctx, ...r });
      if (r.type === 'TEMPLATE_TEXT') return drawWrappedText({ ctx, ...r });
      if (r.type === 'TEXT') {
        return drawWrappedText({ ctx, ...r });
      }
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
