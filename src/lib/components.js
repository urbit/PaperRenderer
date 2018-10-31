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
} from './utils';

import { loadQR, loadSigil } from './load';


const SEEDSIZE = '128 Bits';
const BIP32_DERIVATION_PATH = `/m/44’/60’/0’/0`;
const AT_LOAD_QR_SIZE = 100;
const AT_LOAD_SIGIL_SIZE = 100;
const PAT = /(\@)/g;


const mapInsert = (c, t) => map(values(t.renderables), r => insert(flatten(c), r));

const insert = (fc, r) => {
  const { type, text, data } = r;

  if (type === 'TEXT') {
    // if this is a template variable, replace the @key with actual data
    if (match(text, PAT)) return {...r, text: retrieve(fc, replace(text, PAT, '')) };
    return r;
  };

  if (type === 'SIGIL') return {...r, img: retrieve(fc, replace(data, PAT, '')) };

  if (type === 'QR') return {...r, img: retrieve(fc, replace(data, PAT, '')) };

  throw new Error(`insert() cannot find a renderables for type: ${type}`);
};



const assignBin = (classOf, pageType) => {
  if (classOf === 'galaxy') {
    if (pageType === 'masterTicket') return '1'
    if (pageType === 'masterTicketShard') return '1'
    if (pageType === 'spawn') return '1'
    if (pageType === 'voting') return '1'
    if (pageType === 'managment') return '1'
    if (pageType === 'transfer') return '1'
    throw new Error(`assignBin() cannot find a _type: ${_type} in props: ${props} for galaxy`);
  }

  if (classOf === 'star') {
    if (pageType === 'masterTicket') return '1'
    if (pageType === 'masterTicketShard') return '1'
    if (pageType === 'spawn') return '1'
    if (pageType === 'voting') return '1'
    if (pageType === 'managment') return '1'
    if (pageType === 'transfer') return '1'
    throw new Error(`assignBin() cannot find a _type: ${_type} in props: ${props} for star`);
  }

  if (classOf === 'planet') {
    if (pageType === 'masterTicket') return '1'
    if (pageType === 'masterTicketShard') return '1'
    if (pageType === 'spawn') return '1'
    if (pageType === 'voting') return '1'
    if (pageType === 'managment') return '1'
    if (pageType === 'transfer') return '1'
    throw new Error(`assignBin() cannot find a _type: ${_type} in props: ${props} for planet`);
  }

  throw new Error(`assignBin() cannot find a classOf: ${classOf}`);
};



const bin = (page, props) => {
  return {
    ship: props.patp,
    collateralType: props._type,
    page,
    bin: assignBin(props._classOf, props._type),
  };
};



const mapBin = (pages, props) => map(pages, page => bin(page, props));



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

  const renderables = mapInsert(props, retrieve(templates, TEMPLATE));

  const page = {
    renderables,
    bin: assignBin(props._classOf, props._type),
    collateralType: props._type,
    ship: props.patp,
  }

  return [page];
}







export {
  MasterTicketComponent,
  // MasterTicketShardsComponent,
  // SeedComponent,
  // ManifestComponent,
}
