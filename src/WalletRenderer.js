import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map } from 'lodash';
// import JSZip from 'jszip';
import saveAs from 'file-saver';


import {
  initCanvas,
  dataURItoBlob,
  wordWrap,
  inject,
  injectContent,
} from './lib/walletRenderer';

import {
  drawQR,
  drawSigil,
  drawText,
  drawWrappedText,
} from './lib/draw';


class WalletRenderer extends Component {
  constructor(props) {
    super(props)
    this.wr_ref = React.createRef();
    this.canvas = null;
    this.state = {
      renderedCollateral: null,
    };
  };



  componentDidMount = () => {
    this.canvas = initCanvas(this.wr_ref, { x: 612, y: 792 });
    const { collateral, templates } = this.props;

    // console.log(collateral, templates)

    map(collateral, coll => {
      const template = templates[coll.template]
      const collateralWithRenderables = injectContent(coll, template)
      return this.drawLayout(collateralWithRenderables);
    })
  };



  drawLayout = collateralWithRenderables => {

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#000";

    map(collateralWithRenderables.renderables, renderable => {
      if (renderable.type === 'QR') drawQR({ctx, ...renderable});
      if (renderable.type === 'SIGIL') drawSigil({ctx, ...renderable});
      if (renderable.type === 'TEXT') drawWrappedText({ctx, ...renderable});
    });

    return this.convertToImage();
  };


  // renderTestPage = (params) => {
  //   this.clearCanvas();
  //   const ctx = this.canvas.getContext('2d');
  //
  //   ctx.font = '68px WorkSans-Medium';
  //   ctx.fillText('zZ', 0, 270);
  //
  //   ctx.font = '68px WorkSans-SemiBold';
  //   ctx.fillText('aA', 0, 370);
  //
  //   ctx.font = '68px WorkSans-SemiBold';
  //   ctx.fillText('gG', 0, 470);
  //
  //   ctx.font = '68px WorkSans-SemiBold';
  //   ctx.fillText('~', 0, 570);
  //   return this.convertToImage();
  // };

  convertToImage = () => {
    const png = dataURItoBlob(this.canvas.toDataURL("image/png"));
    return png;
  };

  // bin = () => {
  //
  // };

  download = () => {
    const { renderedWallets } = this.state;
    // const zip = new JSZip();
    // // const t1 = zip.folder('test-tempurature-1');
    // // const t2 = zip.folder("t2");
    // // const t3 = zip.folder("t3");
    // // const t4 = zip.folder("t4");
    //
    // var img = zip.folder("images");
    // img.file("wallet.png", renderedWallets[0].image, {base64: true});
    //
    //
    // zip.generateAsync({type:"blob"})
    //   .then(c => { saveAs(c, 'Urbit Wallets.zip')});
  };

  render() {
    return (
      <div className={'flex flex-column'}>
        <button onClick={() => this.download()}>{'Download'}</button>
        <canvas
          // resize={'true'}
          // style={{ border:'1px solid black' }}
          ref={ wr_ref => this.wr_ref = wr_ref } />
      </div>

    );
  };
};

export default WalletRenderer
