import flatten from 'flat';
import { isUndefined, chunk } from 'lodash';

import {
  values,
  match,
  replace,
  toUpperCase,
} from './reset';

import {
  dateToDa,
  retrieve,
  getCustodyLevel,
  getTitleByCustody,
  shim,
  assignBin,
  mapInsert,
} from './utils';

import { loadQR, loadSigil } from './load';


const BIP32_DERIVATION_PATH = `m/44'/60'/0'/0/0`;
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
    },
    ownership: {
      seed: {
        mnemonic: retrieve(wallet, 'ownership.seed'),
      },
      ethereum: {
        address: retrieve(wallet, 'ownership.keys.address'),
        qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'ownership.keys.address')),
      },
    },
    meta: {
      createdOn: dateToDa(new Date()),
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
    },
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };

  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    bin: assignBin(props._classOf, props._type),
    collateralType: props._type,
    pageTitle: `${props.patp} Master Ticket`,
    ship: props.patp,
  }];

  return page;
}

const ManagementComponent = async (wallet, constants, templates) => {
  const KEY = 'management';
  const TEMPLATE = `MANAGEMENT:${toUpperCase(retrieve(wallet, 'ship.class'))}`;
  const TITLE = getTitleByCustody(retrieve(wallet,'ship.class'));

  const props = {
    heading: TITLE,
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    management: {
      seed: {
        mnemonic: retrieve(wallet, 'management.seed'),
        derivationPath: BIP32_DERIVATION_PATH,
      },
      ethereum: {
        address: retrieve(wallet, 'management.keys.address'),
        qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'management.keys.address')),
      },
    },
    meta: {
      createdOn: dateToDa(new Date()),
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
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
    pageTitle: `${props.patp} ${TITLE}`,
  }];

  return page;
};


const MultipassComponent = async (wallet, constants, templates) => {
  const KEY = 'multipass';
  const TEMPLATE = `MULTIPASS:${toUpperCase(retrieve(wallet, 'ship.class'))}`

  const props = {
    heading: 'Multipass',
    patp: retrieve(wallet, 'ship.patp'),
    azimuthLink: `${patp}.azimuth.network`,
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    ownership: {
      ethereum: {
        address: retrieve(wallet, 'management.keys.address'),
        qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'management.keys.address')),
      },
    },
    meta: {
      createdOn: dateToDa(new Date()),
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
    pageTitle: `${props.patp} Multipass`,
  }];

  return page;
};

export {
  MasterTicketComponent,
  ManagementComponent,
  MultipassComponent,
}
