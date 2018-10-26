import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, reduce, isUndefined, get } from 'lodash';
import SingleRenderer from './SingleRenderer';
import ob from 'urbit-ob';

import { dateToDa } from './lib/utils';

import templates from './lib/templates';
import copy from './lib/copy';


const zipDataSources = (wallet, copy, dataGetters, selector) => dataGetters[selector](wallet, copy);



const generateRenderable = (wallet, copy, templates, dataGetters, selector) => {
  const collateral = zipDataSources(wallet, copy, dataGetters, selector);
  const template = templates[collateral.template];
  const renderables = injectContent(collateral, template);

  return {
    ...collateral,
    renderables,
  };
};



const injectContent = (collateral, template) => {

  if (isUndefined(collateral)) throw new Error('collateral is undefined in injectContent');
  if (isUndefined(template)) throw new Error('template is undefined in injectContent');

  const PAT = /(\@)/g;

  const renderablesWithRealDataAdded = map(template.renderables, r => {
      if (r.type === 'TEXT') {
        if (r.text.match(PAT)) {
          return {
            ...r,
            text: collateral[r.text.replace(PAT, '')],
          }
        } else {
          return r;
        }
      };

      if (r.type === 'SIGIL') {
        return {
          ...r,
          data: collateral[r.data.replace(PAT, '')],
        }
      };

      if (r.type === 'QR') {
        return {
          ...r,
          data: collateral[r.data.replace(PAT, '')],
        }
      };

      throw new Error(`Data of renderable ${r} of type ${r.type} could not be zipped with data in injectContent`);
  });

  return renderablesWithRealDataAdded;
};



const getOrThrow = (obj, path) => {
  const result = get(obj, path)
  if (isUndefined(result)) {
   throw new Error(`Tried to get item at path ${path} from wallet object and failed.`)
  } else {
    return result;
  };
}


const getTicketSize = (seedName, classOf) => {
  if (seedName === 'masterTicket' && classOf === 'galaxy') return '384 Bits'
  if (seedName === 'masterTicketShard' && classOf === 'galaxy') return '128 Bits'
  if (seedName === 'masterTicket' && classOf === 'planet') return '64 Bits'
  return '128 Bits'
}


const SEEDSIZE = '128 Bits'


const dataGetters = {
  MASTER_TICKET: (w, copy) => {
    const SEEDNAME = 'masterTicket';
    const data = {
      template: 'MASTER_TICKET',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Master Ticket',
      ticket: getOrThrow(w, 'ticket'),
      ticketSize: getTicketSize(SEEDNAME, getOrThrow(w, 'ship.class')),
      ownershipMnemonic: getOrThrow(w, 'ownership.seed'),
      ownershipMnemonicSize: SEEDSIZE,
      ownershipMnemonicDerivationPath: 'TBD',
      ownershipAddress: getOrThrow(w, 'ownership.keys.address'),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: dateToDa(new Date()),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
    };
    return data;
  },

  // TODO NOT DONE. DOES NOT MAP SHARDS.
  MASTER_TICKET_SHARDS: (w, copy) => {
    const SEEDNAME = 'masterTicketShard';
    const data = {
      template: 'MASTER_TICKET',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Master Ticket',
      ticket: getOrThrow(w, 'ticket'),
      ticketSize: getTicketSize(SEEDNAME, getOrThrow(w, 'ship.class')),
      ownershipMnemonic: getOrThrow(w, 'ownership.seed'),
      ownershipMnemonicSize: SEEDSIZE,
      ownershipMnemonicDerivationPath: 'TBD',
      ownershipAddress: getOrThrow(w, 'ownership.keys.address'),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: dateToDa(new Date()),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
    }
    return data;
  },
  SPAWN: (w, copy) => {
    const SEEDNAME = 'spawn';
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Spawn Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: SEEDSIZE,
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: dateToDa(new Date()),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Spawn Proxy Address',
    }
    return data
  },
  TRANSFER: (w, copy) => {
    const SEEDNAME = 'transfer';
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Transfer Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: SEEDSIZE,
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: dateToDa(new Date()),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Transfer Proxy Address',
    };
    return data;
  },
  VOTING: (w, copy) => {
    const SEEDNAME = 'voting';
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Voting Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: SEEDSIZE,
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: dateToDa(new Date()),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Voting Proxy Address',
    };
    return data;
  },
  MANAGEMENT: (w, copy) => {
    const SEEDNAME = 'management';
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Management Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: SEEDSIZE,
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: dateToDa(new Date()),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Management Proxy Address',
    };
    return data;
  },
};



const DOCKET = {
  'galaxy': ['MASTER_TICKET_SHARDS', 'SPAWN', 'VOTING', 'TRANSFER', 'MANAGEMENT'],
  'star': ['MASTER_TICKET', 'SPAWN', 'TRANSFER', 'MANAGEMENT'],
  'planet': ['MASTER_TICKET', 'TRANSFER', 'MANAGEMENT'],
};



// transform the wallet from keygen-js into a shape more easily iterable
const shim = kg_wallet => {
  const reshaped = Object.entries(kg_wallet).map(([shipAddr, shipWallet]) => {
    const shipClass = ob.tierOfadd(parseInt(shipAddr));
    return {
      ...shipWallet,
      ship: {
        patp: ob.add2patp(parseInt(shipAddr)),
        addr: shipAddr,
        class: shipClass,
      },
      docket: DOCKET[shipClass],
    }
  });
  return reshaped;
};



class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
    };
    this.latch = false;
    this.totalCollateral = 0;
    this.collateralCounter = 0;
    this.results = [];
  }

  handleOutput = (output, total) => {
    this.collateralCounter = this.collateralCounter + 1

    this.results = [...this.results, output]

    if (this.collateralCounter === total) {
      this.props.callback(this.results)
    }
  }

  render() {
    if (this.latch === false) {

      const wallets = shim(this.props.wallet)
      const totalCollateral = reduce(wallets, (acc, row) => acc + row.docket.length, 0);

      // TODO calculate and add count of public address manifest pages.
      this.totalCollateral = totalCollateral;
      this.latch = true;

      return (
        <div className={this.props.className}>
          {
            wallets.map(wallet => {
              const renderableLayouts = map(wallet.docket, selector => {
                const renderableLayout = generateRenderable(wallet, copy, templates, dataGetters, selector);
                return <SingleRenderer renderableLayout={renderableLayout} callback={output => this.handleOutput(output, totalCollateral)} />
              })
              return renderableLayouts;
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
