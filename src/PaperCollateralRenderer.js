import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, reduce, isUndefined } from 'lodash';
import PageRenderer from './PageRenderer';
import ob from 'urbit-ob';

import { shim } from './lib/utils';

import templates from './lib/templates.json';
import constants from './lib/copy';

import {
  MasterTicketComponent,
  MasterTicketShardsComponent,
} from './lib/components'



// w: wallet
// ws: wallets
// cs: constants
// ts: templates
// Use partial application to make asynchonous execution easier later
const PROFILES = {
  'CONVENTIONAL': {
    'galaxy': [
      // (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      (w, cs, ts) => () => MasterTicketShardsComponent(w, cs, ts),
      // (w, cs, ts) => () =>  SpawnSeedComponent(w, copy, ts),
      // (w, cs, ts) => VotingSeedComponent(w, copy, ts),
      // (w, cs, ts) => TransferSeedComponent(w, copy, ts),
      // (w, cs, ts) => ManagmentSeedComponent(w, copy, ts),

    ],
    'star': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      // (w, cs, ts) => SpawnSeedComponent(w, cs, ts),
      // (w, cs, ts) => TransferSeedComponent(w, cs, ts),
      // (w, cs, ts) => ManagmentSeedComponent(w, cs, ts),
    ],
    'planet': [
      (w, cs, ts) => () => MasterTicketComponent(w, cs, ts),
      // (w, cs, ts) => TransferSeedComponent(w, cs, ts),
      // (w, cs, ts) => ManagmentSeedComponent(w, cs, ts),
    ],
    'manifest': [
      // (ws) => AddressManifestComponent(ws, cs, ts),
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
    this.counter = 0;
    this.results = [];
  }

  handleOutput = (output, total) => {
    this.counter = this.counter + 1

    this.results = [...this.results, output]

    if (this.counter === total) {
      this.props.callback(this.results)
    }
  }



  componentDidMount = () => {
    // const totalCollateral = reduce(wallets, (acc, row) => acc + row.docket.length, 0);

    // TODO calculate and add count of public address manifest pages.
    // this.totalCollateral = totalCollateral;
    // this.latch = true;

    const wallets = shim(this.props.wallet);

    const docket = PROFILES[this.props.mode];

    // console.log(wallets, docket)

    const docketFunctions = reduce(wallets, (acc, wallet) => {
      const collateral = docket[wallet.ship.class]
      const componentFunctions = map(collateral, f => f(wallet, constants, templates))
      return [...acc, ...componentFunctions];
    }, []);

    Promise.all(map(docketFunctions, f => f()))
      .then(pageGroups => {
        const flats = reduce(pageGroups, (acc, arr) => [...acc, ...arr], []);
        this.setState({ pages: flats, totalPages: flats.length });
    });

  }



  render() {
    const { pages, totalPages } = this.state
    if (this.latch === false && pages !== null) {
      this.latch = true;

      return (
        <div className={ this.props.className }>
          {
            map(pages, page => {
              return <PageRenderer page={page} callback={output => this.handleOutput(output, totalPages)}/>
            })
          }
        </div>
      );
    } else {
      return <div/>
    }
  };
};




export default PaperCollateralRenderer
