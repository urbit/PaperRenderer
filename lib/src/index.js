import React, { Component } from 'react';
// import PageRenderer from './PageRenderer';
// import { get } from 'lodash';
import templates from './templates.json';
// import constants from './lib/copy';

import {
  initCanvas,
  // dataURItoBlob,
  // shim
} from './lib/utils';

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

// import {
//   MasterTicketComponent,
//   MasterTicketShardsComponent,
//   ManagementComponent,
//   MultipassComponent,
//   SpawnComponent,
//   TransferComponent,
//   VotingComponent,
// } from './lib/components'

import { loadImg, loadQR, loadSigil } from './lib/load';

const QR_LOADING_SIZE = 100;
const SIGIL_LOADING_SIZE = 100;

// w: wallet
// ws: wallets
// cs: constants
// ts: templates
// Use partial application to make asynchonous execution easier later
// const PROFILES = {
//   'REGISTRATION': {
//     'galaxy': [
//       (w, cs, ts) => () => MasterTicketShardsComponent(w, cs, ts),
//       (w, cs, ts) => () => ManagementComponent(w, cs, ts),
//       (w, cs, ts) => () => MultipassComponent(w, cs, ts),
//       (w, cs, ts) => () => SpawnComponent(w, cs, ts),
//       (w, cs, ts) => () => TransferComponent(w, cs, ts),
//       (w, cs, ts) => () => VotingComponent(w, cs, ts),
//     ],
//     'star': [
//       (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
//       (w, cs, ts) => () => ManagementComponent(w, cs, ts),
//       (w, cs, ts) => () => MultipassComponent(w, cs, ts),
//       (w, cs, ts) => () => SpawnComponent(w, cs, ts),
//       (w, cs, ts) => () => TransferComponent(w, cs, ts),
//     ],
//     'planet': [
//       (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
//       (w, cs, ts) => () => ManagementComponent(w, cs, ts),
//       (w, cs, ts) => () => MultipassComponent(w, cs, ts),
//       (w, cs, ts) => () => TransferComponent(w, cs, ts),
//     ],
//   }
// }



class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.latch = false;
    this.canvasRef = React.createRef();
    this.canvas = null;
    this.state = {
      // results: [],
      // pages: null,
      // totalPages: null,
    };

  }

  extendWallet(wallets) {
    const walletsClone = JSON.parse((JSON.stringify(wallets)))
    walletsClone.map(async wallet => {
      if (wallet.meta !== undefined) {
        // load sigil
        const patp = wallet.meta.patp
        const sigil = await loadSigil(SIGIL_LOADING_SIZE, patp)
        wallet.meta.sigil = sigil
      }

      if (wallet.ownership.keys !== undefined) {
        // load address qr codes
        const addr = wallet.ownership.keys.address
        const qr = await loadQR(QR_LOADING_SIZE, addr)
        wallet.ownership.keys.addrQr = qr
      }

      if (wallet.spawn.keys !== undefined) {
        // load address qr codes
        const addr = wallet.spawn.keys.address
        const qr = await loadQR(QR_LOADING_SIZE, addr)
        wallet.spawn.keys.addrQr = qr
      }

      if (wallet.management.keys !== undefined) {
        // load address qr codes
        const addr = wallet.management.keys.address
        const qr = await loadQR(QR_LOADING_SIZE, addr)
        wallet.management.keys.addrQr = qr
      }

      if (wallet.voting.keys !== undefined) {
        // load address qr codes
        const addr = wallet.voting.keys.address
        const qr = await loadQR(QR_LOADING_SIZE, addr)
        wallet.voting.keys.addrQr = qr
      }

      if (wallet.transfer.keys !== undefined) {
        // load address qr codes
        const addr = wallet.transfer.keys.address
        const qr = await loadQR(QR_LOADING_SIZE, addr)
        wallet.transfer.keys.addrQr = qr
      }

      return wallet

      // Reminder: Still have async loading to do. There is the key icon in Figma.

    })
    // console.log(wallets)
    return walletsClone
  }


  preprocess() {

  }


  componentDidMount() {

    this.canvas = initCanvas(this.canvasRef.current, { x: 612, y: 792 }, 4);

    const extendedWallet = this.extendWallet(this.props.wallet)

    // const wallets = shim(this.props.wallet);

    // const docket = PROFILES[this.props.mode];

    // const docketFunctions = wallets.reduce((acc, wallet) => {
    //   const collateral = docket[wallet.ship.class]
    //   const componentFunctions = collateral.map(f => f(wallet, constants, templates))
    //   return [...acc, ...componentFunctions];
    // }, []);
    //
    // const withManifest = [
    //   ...docketFunctions,
    //   // ...docket.manifest.map(f => f(wallets, constants, templates))
    // ]
    // // console.log(withManifest);
    // Promise.all(withManifest.map(f => f()))
    //   .then(pageGroups => {
    //     const flats = pageGroups.reduce((acc, arr) => [...acc, ...arr], []);
    //     // this.setState({ pages: flats, totalPages: flats.length });
    //
    //     const results = flats.map(page => this.drawLayout(page));
    //     // this.latch=true
    //     this.props.callback(results);
    // })
    // .catch(err => console.error(err));
  }


  // drawLayout = (page) => {
  //
  //   const ctx = this.canvas.getContext('2d');
  //
  //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //
  //   ctx.fillStyle="#FFF";
  //   ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  //
  //   ctx.fillStyle="#000";
  //
  //   page.renderables.forEach(r => {
  //     if (r.type === 'qr') return drawQR({ ctx, ...r });
  //     if (r.type === 'patq') return drawPatQ({ ctx, ...r });
  //     if (r.type === 'img') return drawImg({ ctx, ...r });
  //     if (r.type === 'addr_split_four') return drawEthereumAddressLong({ ctx, ...r });
  //     if (r.type === 'wrap_addr_split_four') return drawEthereumAddressCompact({ ctx, ...r });
  //     if (r.type === 'sigil') return drawSigil({ ctx, ...r });
  //     if (r.type === 'rect') return drawRect({ ctx, ...r });
  //     if (r.type === 'hr') return drawLine({ ctx, ...r });
  //     if (r.type === 'template_text') return drawWrappedText({ ctx, ...r });
  //     if (r.type === 'text') return drawWrappedText({ ctx, ...r });
  //   });
  //
  //   const pageWithImageData = {
  //     ship: page.ship,
  //     collateralType: page.collateralType,
  //     bin: page.bin,
  //     page: get(page, 'page', '1'),
  //     pageTitle: page.pageTitle,
  //     png: dataURItoBlob(this.canvas.toDataURL("image/png")),
  //     durl: this.canvas.toDataURL("image/png"),
  //   };
  //   return pageWithImageData;
  // };



  render() {
    return (
      <canvas className={ this.props.className } ref={ this.canvasRef } />
    )
    // ensure items are only rendered once, and not on every rerender
    // if (this.latch === false) {
    //   this.latch = true;
    //   return (
    //     <canvas className={ this.props.className } ref={ this.canvasRef } />
    //   );
    // } else {
    //   return <div/>
    // }
  };
};




export default PaperCollateralRenderer
