import ob from 'urbit-ob';
import flatten from 'flat';
import { map, get, isUndefined } from 'lodash';

import {
  values,
  match,
  replace,
  toUpperCase,
} from './reset';

import {
  dateToDa,
  retrieve,
  getTicketSize,
  shim,
  assignBin,
  mapInsert,
} from './utils';

import { loadQR, loadSigil } from './load';


const SEEDSIZE = '128 Bits';
const BIP32_DERIVATION_PATH = `/m/44’/60’/0’/0`;
const AT_LOAD_QR_SIZE = 100;
const AT_LOAD_SIGIL_SIZE = 100;
const PAT = /(\@)/g;



const MasterTicketComponent = async (wallet, constants, templates) => {
  const KEY = 'masterTicket';
  const TEMPLATE = `MASTER_TICKET:${toUpperCase(retrieve(wallet, 'ship.class'))}`

  const props = {
    heading: 'Master Ticket',
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    ticket: {
      data: retrieve(wallet, 'ticket'),
      size: getTicketSize(KEY, retrieve(wallet, 'ship.class')),
    },
    ownership: {
      seed: {
        mnemonic: retrieve(wallet, 'ownership.seed'),
        size: SEEDSIZE,
        derivationPath: BIP32_DERIVATION_PATH,
      },
      ethereum: {
        address: retrieve(wallet, 'ownership.keys.address'),
        qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'ownership.keys.address')),
      },
    },
    copy: {
      custody: retrieve(constants, `custody.${[wallet.ship.class]}.${[KEY]}`),
      usage: retrieve(constants, `usage.${[wallet.ship.class]}.${[KEY]}`),
    },
    meta: {
      createdOn: dateToDa(new Date()),
      walletVersion: constants.meta.walletVersion,
      moreInformation: constants.meta.moreInformation,
    },
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };

  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    bin: assignBin(props._classOf, props._type),
    collateralType: props._type,
    ship: props.patp,
  }];

  return page;
}




// const AddressManifestComponent = async (wallets, constants, templates) => {
//   const KEY = 'addressManifest';
//   const TEMPLATE = 'addressManifest'
// }




const MasterTicketShardsComponent = async (wallet, constants, templates) => {
  const pages = await map(wallet.shards, async (shard, index) => {
    const KEY = `masterTicketShard_${index + 1}`;
    const TEMPLATE = `MASTER_TICKET_SHARD:${toUpperCase(retrieve(wallet, 'ship.class'))}`;
    const props = {
      heading: `Master Ticket Shard ${index + 1} of ${wallet.shards.length}`,
      patp: retrieve(wallet, 'ship.patp'),
      sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
      shard: {
        data: shard,
        size: getTicketSize('masterTicketShard', retrieve(wallet, 'ship.class')),
      },
      ownership: {
        seed: {
          mnemonic: shard,
          size: SEEDSIZE,
          derivationPath: BIP32_DERIVATION_PATH,
        },
        ethereum: {
          address: retrieve(wallet, 'ownership.keys.address'),
          qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'ownership.keys.address')),
        },
      },
      copy: {
        // custody: retrieve(constants, `custody.${[wallet.ship.class]}.${[KEY]}`),
        // usage: retrieve(constants, `usage.${[wallet.ship.class]}.${[KEY]}`),
      },
      meta: {
        createdOn: dateToDa(new Date()),
        walletVersion: constants.meta.walletVersion,
        moreInformation: constants.meta.moreInformation,
      },
      _classOf: retrieve(wallet, 'ship.class'),
      _type: 'masterTicketShard',
      _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
    };

    const page = {
      renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
      bin: assignBin(props._classOf, props._type),
      collateralType: props._type,
      ship: props.patp,
    };

    return page;

  });

  return Promise.all(pages).then(results => results)
};






export {
  MasterTicketComponent,
  MasterTicketShardsComponent,
  // SeedComponent,
  // ManifestComponent,
}
