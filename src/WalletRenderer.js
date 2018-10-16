import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map } from 'lodash'
import fileDownload from 'js-file-download';
import qr from 'qr-image';
// import jszip from 'jszip';
import { pour } from 'sigil-js'
// import ReactSVGComponents from './ReactSVGComponents'
import PlainSVGStringRenderer from './PlainSVGStringRenderer'

import {
  initCanvas,
  dataURItoBlob,
  wordWrap,
} from './lib/walletRenderer';

// Line heights
const LH = {
  h1: 38,
  h2: 14,
  p: 14,
  mono: 14,
}

const COLW = 248

const ML = 48


class WalletRenderer extends Component {
  constructor(props) {
    super(props)
    this.wr_ref = React.createRef();
    this.canvas = null;
    this.state = {};
  };


  componentDidMount = () => {
    this.canvas = initCanvas(this.wr_ref, { x: 612, y: 792 });
    const { renderables } = this.props

    const wallets = renderables.map(item => {
      if (item.type === 'masterTicket') {
        return { ...item, image: this.renderMasterTicket(item) };
      };
    });

    // console.log(wallets)
  };

  clearCanvas = () => {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };


  // drawTitle = (ctx, text) => {
  //   ctx.font = '32px WorkSans-Medium';
  //   ctx.fillText(text, ML, 50);
  // }
  //
  // drawShipField = (ctx, text) => {
  //   ctx.font = '10px SF Pro Text';
  //   ctx.fillText('Ship', ML, 300);
  //
  //   ctx.font = '10px Source Code Pro';
  //   ctx.fillText(text, ML, 320);
  // }
  sigil = (ctx, patp, x, y, size) => {
    const svg = pour({
      size: size,
      patp: patp,
      colorway: ['white', 'black'],
      renderer: PlainSVGStringRenderer,
      margin: 1,
    });
    const svg64 = btoa(svg);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;
    let img = new Image;
    img.onload = () => ctx.drawImage(img, x, y);
    img.src = image64;
  }

  qr = (ctx, content, x, y, size) => {
    const svg = qr.imageSync(content, { type: 'svg', size, });
    const svg64 = btoa(svg);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;
    let img = new Image;
    img.onload = () => ctx.drawImage(img, x, y);
    img.src = image64;
  }

  type = {
    h1: (ctx, text, x, y) => {
      ctx.font = '32px WorkSans-Medium';
      ctx.fillText(text, x, y);
    },
    h2: (ctx, text, x, y) => {
      ctx.font = '10px SFProText-Regular';
      ctx.fillText(text, x, y);
    },
    h3: (ctx, text, x, y) => {
      ctx.font = '9px SFProText-Regular';
      ctx.fillText(text, x, y);
    },
    mono: (ctx, text, x, y) => {
      ctx.font = '10px SourceCodePro-Regular';
      ctx.fillText(text, x, y);
    },
    p: (ctx, text, x, y) => {
      ctx.font = '9px SFProText-Light';
      ctx.fillText(text, x, y);
    }
  }

  draw = {
    walletTitle: (ctx, text) => {
      map(text, (t, i) => {
        this.type.h1(ctx, t, ML, (50 + (i * LH.h1)) )
      })
    },
    shipName: (ctx, text) => {
      this.type.h2(ctx, 'Ship', ML, 300)
      this.type.mono(ctx, text, ML, 320)
    },
    ticket: (ctx, ticket, size) => {
      this.type.h2(ctx, 'Ticket', ML, 350)
      map(ticket, (t, i) => {
        this.type.mono(ctx, t, ML, (370 + (i * LH.mono)) )
      })
      this.type.h3(ctx, 'Size:', ML, 400)
      this.type.mono(ctx, size, 70, 400)
    },
    ownershipSeed: (ctx, seed, size, path) => {
      this.type.h2(ctx, 'Ownership Seed BIP32 Menmonic', ML, 430)
      wordWrap(ctx, seed, ML, 450, LH.mono, COLW, '10px SourceCodePro-Regular')
      this.type.h3(ctx, 'Size:', ML, 475)
      this.type.mono(ctx, size, 70, 475)
      this.type.h3(ctx, 'Derivation Path:', ML, 490)
      this.type.mono(ctx, size, 124, 490)
    },
    ownershipAddress: (ctx, addr, size) => {
      this.type.h3(ctx, 'Ownership Address:', ML, 530)
      this.qr(ctx, addr, ML, 550, size)
    },
    createdOn: (ctx, date) => {

    },
    walletVersion: (ctx, version) => {

    },
    info: (ctx, link) => {

    },
    custody: (ctx, text) => {

    },
    usage: (ctx, text) => {

    }

  }



  renderMasterTicket = (item) => {
    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.draw.walletTitle(ctx, item.title);
    this.sigil(ctx, item.patp, 48, 210, 70);
    this.draw.shipName(ctx, item.patp);
    this.draw.ticket(ctx, item.ticket, item.ticketSize);

    this.draw.ownershipSeed(
      ctx,
      item.ownerSeedMnemonic,
      item.ownerSeedMnemonicSize,
      item.derivationPath,
    );

    this.draw.ownershipAddress(
      ctx,
      item.ownershipAddress,
      2,
    );



    return this.convertToImage();
  };

  // renderSeed = (params) => {
  //   this.clearCanvas();
  //   const ctx = this.canvas.getContext('2d');
  //
  //   return this.convertToImage();
  // };
  //
  // renderAddressManifest = (params) => {
  //   this.clearCanvas();
  //   const ctx = this.canvas.getContext('2d');
  //
  //   return this.convertToImage();
  // };

  renderTestPage = (params) => {
    this.clearCanvas();
    const ctx = this.canvas.getContext('2d');

    ctx.font = '68px WorkSans-Medium';
    ctx.fillText('Urbit', 0, 270);

    ctx.font = '68px WorkSans-SemiBold';
    ctx.fillText('Urbit', 0, 370);

    ctx.font = '68px WorkSans-SemiBold';
    ctx.fillText('gG', 0, 470);

    ctx.font = '68px WorkSans-SemiBold';
    ctx.fillText('Master Ticket', 0, 570);
    return this.convertToImage();
  };

  convertToImage = () => {
    const png = dataURItoBlob(this.canvas.toDataURL("image/png"));
    return png;
  };

  // bin = () => {
  //
  // };

  // download = wallets => {
  //   const zip = new JSZip();
  //   const t1 = zip.folder("t1");
  //   const t2 = zip.folder("t2");
  //   const t3 = zip.folder("t3");
  //   const t4 = zip.folder("t4");
  //
  //   // const t1Wallets = filter
  //
  //   // img.file("smile.gif", imgData, {base64: true});
  //
  //   // jsFileDownload(png, 'test.png')
  //   zip.generateAsync({type:"blob"})
  //     .then(c => { saveAs(c, 'Urbit Wallets.zip')});
  // };

  render() {
    return (
      <div>
        <canvas
          // resize={'true'}
          // style={{ border:'1px solid black' }}
          ref={ wr_ref => this.wr_ref = wr_ref } />
      </div>

    );
  };
};

export default WalletRenderer
