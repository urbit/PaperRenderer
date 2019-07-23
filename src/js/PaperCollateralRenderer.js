import React, { Component } from 'react';
import PageRenderer from './PageRenderer';

import { shim } from './lib/utils';
import templates from './templates.json';
import constants from './lib/copy';

import {
  MasterTicketComponent,
  ManagementComponent,
  AddressManifestComponent,
} from './lib/components'



// w: wallet
// ws: wallets
// cs: constants
// ts: templates
// Use partial application to make asynchonous execution easier later
const PROFILES = {
  'REGISTRATION': {
    'galaxy': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      // (w, cs, ts) => () => MasterTicketShardsComponent(w, cs, ts),
      // (w, cs, ts) => () => SpawnSeedComponent(w, cs, ts),
      // (w, cs, ts) => () => VotingSeedComponent(w, cs, ts),
      // (w, cs, ts) => () => TransferSeedComponent(w, copy, ts),
      (w, cs, ts) => () => ManagementComponent(w, cs, ts),

    ],
    'star': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      // (w, cs, ts) => () => SpawnSeedComponent(w, cs, ts),
      // (w, cs, ts) => () => TransferSeedComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementComponent(w, cs, ts),
    ],
    'planet': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      // (w, cs, ts) => () => TransferSeedComponent(w, cs, ts),
      (w, cs, ts) => () => ManagementComponent(w, cs, ts),
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



  componentDidMount = () => {

    const wallets = shim(this.props.wallet);

    const docket = PROFILES[this.props.mode];

    const docketFunctions = wallets.reduce((acc, wallet) => {
      const collateral = docket[wallet.ship.class]
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
        this.setState({ pages: flats, totalPages: flats.length });
    });

  }



  render() {
    const { pages, totalPages } = this.state
    if (this.latch === false && pages !== null) {
      this.latch = true;

      return (
        <div className={ this.props.className }>

        <PageRenderer
          pages={pages}
          callback={data => this.props.callback(data)}
        />

        </div>
      );
    } else {
      return <div/>
    }
  };
};




export default PaperCollateralRenderer
