import React, { Component } from 'react';
import { get } from 'lodash'
// import PageRenderer from './PageRenderer';

import { shim } from './lib/utils';

import templates from './templates.json';

import constants from './lib/copy';

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

import {
  MasterTicketComponent,
  MasterTicketShardsComponent,
  AddressManifestComponent,
  SpawnSeedComponent,
  VotingSeedComponent,
  ManagementSeedComponent,
} from './lib/components'



// w: wallet
// ws: wallets
// cs: constants
// ts: templates
// Use partial application to make asynchonous execution easier later
const PROFILES = {
  'REGISTRATION': {
    'galaxy': [
      // (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      (w, cs, ts) => () => MasterTicketShardsComponent(w, cs, ts),
      (w, cs, ts) => () => SpawnSeedComponent(w, cs, ts),
      (w, cs, ts) => () => VotingSeedComponent(w, cs, ts),
      // (w, cs, ts) => () => TransferSeedComponent(w, copy, ts),
      (w, cs, ts) => () => ManagementSeedComponent(w, cs, ts),

    ],
    'star': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      (w, cs, ts) => () => SpawnSeedComponent(w, cs, ts),
      // (w, cs, ts) => () => TransferSeedComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementSeedComponent(w, cs, ts),
    ],
    'planet': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      // (w, cs, ts) => () => TransferSeedComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementSeedComponent(w, cs, ts),
    ],
    'manifest': [
      (ws, cs, ts) => () => AddressManifestComponent(ws, cs, ts),
    ]
  }
}



class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      pages: null,
      totalPages: null,
    };
    this.latch = false;
    this.pcr_ref = React.createRef();

    // this.counter = 0;
    // this.results = [];
  }

  // handleOutput = (output, total) => {
  //   this.counter = this.counter + 1
  //
  //   this.results = [...this.results, output]
  //
  //   if (this.counter === total) {
  //     this.props.callback(this.results)
  //   }
  // }
  //
  //
  //
  // handleOutput = (output, total) => {
  //   if (this.counter === total) {
  //     this.props.callback(this.results)
  //   }
  // }



  componentDidMount() {

    const wallets = shim(this.props.wallet);

    const docket = PROFILES[this.props.mode];

    const docketFunctions = wallets.reduce((acc, wallet) => {
      const collateral = docket[wallet.meta.class]
      const componentFunctions = collateral.map(f => f(wallet, constants, templates))
      return [...acc, ...componentFunctions];
    }, []);

    const withManifest = [
      ...docketFunctions,
      ...docket.manifest.map(f => f(wallets, constants, templates))
    ]

    Promise.all(withManifest.map(f => f()))
      .then(pageGroups => {
        const flats = pageGroups.reduce((acc, arr) => [...acc, ...arr], []);
        // this.setState({ pages: flats, totalPages: flats.length })

        this.canvas = initCanvas(this.pcr_ref, { x: 612, y: 792 }, 4);
        const results = this.props.pages.map(page => this.drawLayout(page));
        this.props.callback(results);
    });

  }

  drawLayout(page) {

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle="#000";

    page.renderables.forEach(r => {
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
      pageTitle: page.pageTitle,
      png: dataURItoBlob(this.canvas.toDataURL("image/png")),
      // durl: this.canvas.toDataURL("image/png"),
    };

    return pageWithImageData;
  };



  render() {
    const { pages, totalPages } = this.state
    if (this.latch === false && pages !== null) {
      this.latch = true;

      return (
        <div className={ this.props.className }>

          <div className={'flex flex-column'}>
            <canvas ref={ pcr_ref => this.pcr_ref = pcr_ref } />
          </div>

        </div>
      );
    } else {
      return <div/>
    }
  };
};




export default PaperCollateralRenderer
