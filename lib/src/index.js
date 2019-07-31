import React, { Component } from 'react';
// import PageRenderer from './PageRenderer';
import { get } from 'lodash';
import templates from './templates.json';
import constants from './lib/copy';

import {
  initCanvas,
  dataURItoBlob,
  wordWrap,
  shim
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

import {
  MasterTicketComponent,
  MasterTicketShardsComponent,
  ManagementComponent,
  MultipassComponent,
  SpawnComponent,
  TransferComponent,
  VotingComponent,
} from './lib/components'



// w: wallet
// ws: wallets
// cs: constants
// ts: templates
// Use partial application to make asynchonous execution easier later
const PROFILES = {
  'REGISTRATION': {
    'galaxy': [
      (w, cs, ts) => () => MasterTicketShardsComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementComponent(w, cs, ts),
      (w, cs, ts) => () => MultipassComponent(w, cs, ts),
      (w, cs, ts) => () => SpawnComponent(w, cs, ts),
      (w, cs, ts) => () => TransferComponent(w, cs, ts),
      (w, cs, ts) => () => VotingComponent(w, cs, ts),
    ],
    'star': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementComponent(w, cs, ts),
      (w, cs, ts) => () => MultipassComponent(w, cs, ts),
      (w, cs, ts) => () => SpawnComponent(w, cs, ts),
      (w, cs, ts) => () => TransferComponent(w, cs, ts),
    ],
    'planet': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementComponent(w, cs, ts),
      (w, cs, ts) => () => MultipassComponent(w, cs, ts),
      (w, cs, ts) => () => TransferComponent(w, cs, ts),
    ],
  }
}



class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.latch = false;
    this.canvasRef = React.createRef();
    this.canvas = null;
    this.state = {
      results: [],
      pages: null,
      totalPages: null,
    };

  }

  extendWallet = wallet => {
    const walletsAsArray = Object.values(wallet)
    console.log(walletsAsArray)
  }


  componentDidMount = () => {

    console.log(this.refs, this.canvasRef, this.canvas)

    this.canvas = initCanvas(this.canvasRef.current, { x: 612, y: 792 }, 4);


    this.extendWallet(this.props.wallet)

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


  drawLayout = (page) => {

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
  };



  render() {
    // const { pages, totalPages } = this.state
    if (this.latch === false) {
      this.latch = true;
      return (
        <canvas className={ this.props.className } ref={ this.canvasRef } />
      );
    } else {
      return <div/>
    }
  };
};




export default PaperCollateralRenderer
