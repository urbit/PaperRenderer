import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, reduce, isUndefined } from 'lodash';
import PaperCollateralRenderer from './PaperCollateralRenderer';
import ob from 'urbit-ob';

import sampleWallet from './lib/sampleWallet';
import templates from './lib/templates';
import copy from './lib/copy';


const zipDataSources = (wallet, copy, dataGetters, selector) => dataGetters[selector](wallet, copy);



const generateRenderable = (wal, copy, templates, dataGetters, selector) => {
  const collateral = zipDataSources(sampleWallet, copy, dataGetters, selector);
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



const dataGetters = {
  MASTER_TICKET: (wallet, copy) => {
    const patp = ob.add2patp(wallet.spawn[0].meta.ship)
    const classOf = ob.tierOfadd(wallet.spawn[0].meta.ship)
    return {
      template: 'MASTER_TICKET',
      // TODO This is bad! (gvn)
      patp: patp,
      heading: 'Master Ticket',
      ticket: ob.hex2patq(wallet.ticket),
      ticketSize: 'TBD',
      // TODO convert to BIP32 mnemonic (gvn)
      ownershipMnemonic: wallet.owner.seed,
      ownershipMnemonicSize: 'TBD',
      ownershipMnemonicDerivationPath: 'TBD',
      // TODO convert to actual ethereum address (gvn)
      ownershipAddress: wallet.owner.keys.public,
      custody: copy.custody[classOf].masterTicket,
      usage: copy.usage[classOf].masterTicket,
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
    }
  },
  // TODO not sure how to tackle shards yet (gvn)
  // MASTER_TICKET_SHARD: (wallet, copy) => ({
  //   template: 'MASTER_TICKET_SHARD',
  //   patp: ob.add2patp(1),
  //   heading: `Master Ticket Shard ${wallet.shardIndex} of 3`,
  //   ticket: ob.hex2patq(wallet.shard),
  //   ticketSize: 'TBD',
  //   // TODO convert to BIP32 mnemonic (gvn)
  //   ownershipMnemonic: wallet.owner.seed,
  //   ownershipMnemonicSize: 'TBD',
  //   ownershipMnemonicDerivationPath: 'TBD',
  //   // TODO convert to actual ethereum address (gvn)
  //   ownershipAddress: wallet.owner.keys.public,
  //   custody: copy.custody.lvl1,
  //   usage: copy.usage.masterTicket,
  //   createdOn: new Date(),
  //   walletVersion: copy.meta.walletVersion,
  //   moreInformation: copy.meta.moreInformation,
  // }),
  SPAWN: (wallet, copy) => {
    const patp = ob.add2patp(wallet.spawn[0].meta.ship)
    const classOf = ob.tierOfadd(wallet.spawn[0].meta.ship)
    return {
      template: 'SEED',
      patp: patp,
      heading: 'Spawn Proxy Seed',
      // TODO convert to mnemonic instead of @P here
      ticket: ob.hex2patq(wallet.spawn[0].seed),
      ticketSize: 'TBD',
      // TODO convert to actual ethereum address
      ownershipAddress: wallet.owner.keys.public,
      // TODO need code paths based on ship type
      custody: copy.custody[classOf].spawn,
      usage: copy.usage[classOf].spawn,
      createdOn: new Date(),
      walletVersion: copy.meta.walletVersion,
      moreInformation: copy.meta.moreInformation,
    }
  },
}



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layouts: null,
    }
  }

  render() {
    const renderableLayout = generateRenderable(sampleWallet, copy, templates, dataGetters, 'MASTER_TICKET')
    return (
      <main id={'page-ref'}>
        {'Render paper collateral'}
        <PaperCollateralRenderer renderableLayout={renderableLayout} callback={result => console.log(result)} />
      </main>
    );
  };
};

export default App
