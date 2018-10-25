import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, reduce, isUndefined, get } from 'lodash';
import PaperCollateralRenderer from './PaperCollateralRenderer';
import ob from 'urbit-ob';

import sampleWallet from './lib/sampleWallet';
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
  }
};



const injectContent = (collateral, template) => {

  if (isUndefined(collateral)) Error('collateral is undefined in injectContent')
  if (isUndefined(template)) Error('template is undefined in injectContent')

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
      }

      if (r.type === 'SIGIL') {
        return {
          ...r,
          data: collateral[r.data.replace(PAT, '')],
        }
      }

      if (r.type === 'QR') {
        return {
          ...r,
          data: collateral[r.data.replace(PAT, '')],
        }
      }
  })

  return renderablesWithRealDataAdded;
};



const getOrThrow = (obj, path) => {
  const result = get(obj, path)
  if (isUndefined(result)) {
   throw new Error(`Tried to get item at path ${path} from wallet object and failed.`)
  } else {
    return result
  }
}


const dataGetters = {
  MASTER_TICKET: (w, copy) => {
    const SEEDNAME = 'masterTicket'
    return {
      template: 'MASTER_TICKET',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Master Ticket',
      ticket: getOrThrow(w, 'ticket'),
      ticketSize: 'TBD',
      ownershipMnemonic: getOrThrow(w, 'ownership.seed'),
      ownershipMnemonicSize: 'TBD',
      ownershipMnemonicDerivationPath: 'TBD',
      ownershipAddress: getOrThrow(w, 'ownership.keys.address'),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
    }
  },

  // TODO NOT DONE. DOES NOT MAP SHARDS.
  MASTER_TICKET_SHARDS: (w, copy) => {
    const SEEDNAME = 'masterTicketShard'
    return {
      template: 'MASTER_TICKET',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Master Ticket',
      ticket: getOrThrow(w, 'ticket'),
      ticketSize: 'TBD',
      ownershipMnemonic: getOrThrow(w, 'ownership.seed'),
      ownershipMnemonicSize: 'TBD',
      ownershipMnemonicDerivationPath: 'TBD',
      ownershipAddress: getOrThrow(w, 'ownership.keys.address'),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
    }
  },
  SPAWN: (w, copy) => {
    const SEEDNAME = 'spawn'
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Spawn Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: '128 Bits',
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Spawn Proxy Address',
    }
    return data
  },
  TRANSFER: (w, copy) => {
    const SEEDNAME = 'transfer'
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Transfer Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: '128 Bits',
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Transfer Proxy Address',
    }
    return data
  },
  VOTING: (w, copy) => {
    const SEEDNAME = 'voting'
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Voting Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: '128 Bits',
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Voting Proxy Address',
    }
    return data
  },
  MANAGEMENT: (w, copy) => {
    const SEEDNAME = 'management'
    const data = {
      template: 'SEED',
      patp: getOrThrow(w, 'ship.patp'),
      heading: 'Management Seed',
      seed: getOrThrow(w, `${SEEDNAME}.seed`),
      seedSize: '128 Bits',
      seedAddress: getOrThrow(w, `${SEEDNAME}.keys.address`),
      custody: getOrThrow(copy, `custody.${[w.ship.class]}.${[SEEDNAME]}`),
      usage: getOrThrow(copy, `usage.${[w.ship.class]}.${[SEEDNAME]}`),
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
      addressTypeHeading: 'Management Proxy Address',
    }
    return data
  },
}


const DOCKET = {
  'galaxy': ['MASTER_TICKET_SHARDS', 'SPAWN', 'VOTING', 'TRANSFER', 'MANAGEMENT'],
  'star': ['MASTER_TICKET', 'SPAWN', 'TRANSFER', 'MANAGEMENT'],
  'planet': ['MASTER_TICKET', 'TRANSFER', 'MANAGEMENT'],
}


const wshim = kg_wallet => {
  const reshaped = Object.entries(kg_wallet).map(([shipAddr, shipWallet]) => {
    const shipClass = ob.tierOfadd(parseInt(shipAddr))
    return {
      ...shipWallet,
      ship: {
        patp: ob.add2patp(parseInt(shipAddr)),
        addr: shipAddr,
        class: shipClass,
      },
      docket: DOCKET[shipClass],
    }
  })
  return reshaped
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layouts: null,
    }
  }

  render() {
    const wallets = wshim(sampleWallet)
    return (
      <main id={'page-ref'}>
        {'Render paper collateral'}
        {
          wallets.map(wallet => {
            const renderableLayouts = map(wallet.docket, selector => {
              const renderableLayout = generateRenderable(wallet, copy, templates, dataGetters, selector)
              return <PaperCollateralRenderer renderableLayout={renderableLayout} callback={result => console.log(result)} />
            })
            return renderableLayouts
          })
        }
      </main>
    );
  };
};

export default App
