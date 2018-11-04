import ob from 'urbit-ob';
import flatten from 'flat';
import { map, get, isUndefined, reduce, chunk } from 'lodash';

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
    pageTitle: `${props.patp} Master Ticket`,
    ship: props.patp,
  }];

  return page;
}




const AddressManifestComponent = async (wallets, constants, templates) => {

  const props = {
    meta: {
      createdOn: dateToDa(new Date()),
      walletVersion: constants.meta.walletVersion,
      moreInformation: constants.meta.moreInformation,
    },
  };

  const listItems = map(wallets, async wallet => {
    return {
      patp: retrieve(wallet, 'ship.patp'),
      ownership: {
        ethereum: {
          address: retrieve(wallet, 'ownership.keys.address'),
          qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'ownership.keys.address')),
        }
      }
    };
  });

  return Promise.all(listItems).then(li => {
    const LI_TOTAL_1 = 4
    const LI_TOTAL_X = 5

    const pageCount = Math.ceil((li.length - LI_TOTAL_1) / LI_TOTAL_X) + 1;

    const firstListItemData = li.slice(0, LI_TOTAL_1);
    const subsequentListItemData = li.slice(LI_TOTAL_1);

    const TEMP_1 = retrieve(templates, 'ADDRESS_MANIFEST:FIRST');
    const TEMP_X = retrieve(templates, 'ADDRESS_MANIFEST:OVERFLOW');

    const LI_COMPONENT = retrieve(templates, 'COMPONENT:ADDRESS_LIST_ITEM');
    const LI_COMPONENT_HEIGHT = 112;

    const P1_LIST_START_Y = 300;
    const P1_LIST_START_X = 48;
    const PX_LIST_START_Y = 160;
    const PX_LIST_START_X = 48;

    const firstPageRenderableListItems = reduce(firstListItemData, (acc, props, listItemIndex) => {
      const moved = map(mapInsert(props, LI_COMPONENT), _r => {
        const r = {..._r}
        r.x = _r.x + P1_LIST_START_X;
        r.y = _r.y + P1_LIST_START_Y + (LI_COMPONENT_HEIGHT * listItemIndex);
        return r;
      });
      return [...acc, ...moved];
    }, []);

    const listItemsBySubsequentPage = chunk(subsequentListItemData, LI_TOTAL_X)

    const subsequentPages = map(listItemsBySubsequentPage, (page, pageIndex) => {

      const listItemsWithData = reduce(page, (acc, props, listItemIndex) => {
        const moved = map(mapInsert(props, LI_COMPONENT), _r => {
          const r = {..._r}
          r.x = _r.x + PX_LIST_START_X;
          r.y = _r.y + PX_LIST_START_Y + (LI_COMPONENT_HEIGHT * listItemIndex);
          return r;
        });
      return [...acc, ...moved];
    }, []);

    return {
      renderables: [
        ...mapInsert({...props, pageAofB: `Page ${pageIndex + 1} of ${pageCount}`}, TEMP_X),
        ...listItemsWithData,
      ],
      bin: '0',
      collateralType: 'ownership_address_manifest',
      ship: 'all',
      pageTitle: `Ownership Address Manifest page ${pageIndex + 2} of ${pageCount}`,
      page: pageIndex + 2,
    }
  });

    const pages = [
      {
        renderables: [
          ...mapInsert({...props, pageAofB: `Page 1 of ${pageCount}`}, TEMP_1),
          ...firstPageRenderableListItems,
        ],
        bin: '0',
        collateralType: 'ownership_address_manifest',
        ship: 'all',
        pageTitle: `Ownership Address Manifest page 1 of ${pageCount}`,
        page: 1,
      },
      ...subsequentPages

    ];

    return pages
  });
}




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
      pageTitle: `${props.patp} Master Ticket Shard ${index + 1} of ${wallet.shards.length}`,
      ship: props.patp,
    };

    return page;

  });

  return Promise.all(pages).then(results => results);
};


const SpawnSeedComponent = async (wallet, constants, templates) => {
  const KEY = 'spawn';
  const TEMPLATE = `SPAWN:${toUpperCase(retrieve(wallet, 'ship.class'))}`

  const props = {
    heading: 'Spawn Seed',
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    spawn: {
      seed: {
        mnemonic: retrieve(wallet, 'spawn.seed'),
        size: SEEDSIZE,
        derivationPath: BIP32_DERIVATION_PATH,
      },
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
    pageTitle: `${props.patp} Spawn Seed`,
  }];

  return page;
};



const VotingSeedComponent = async (wallet, constants, templates) => {
  const KEY = 'voting';
  const TEMPLATE = `VOTING:${toUpperCase(retrieve(wallet, 'ship.class'))}`

  const props = {
    heading: 'Voting Seed',
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    voting: {
      seed: {
        mnemonic: retrieve(wallet, 'voting.seed'),
        size: SEEDSIZE,
        derivationPath: BIP32_DERIVATION_PATH,
      },
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
    pageTitle: `${props.patp} Voting Seed`,
  }];

  return page;
};



const ManagementSeedComponent = async (wallet, constants, templates) => {
  const KEY = 'management';
  const TEMPLATE = `MANAGEMENT:${toUpperCase(retrieve(wallet, 'ship.class'))}`

  const props = {
    heading: 'Management Seed',
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    management: {
      seed: {
        mnemonic: retrieve(wallet, 'management.seed'),
        size: SEEDSIZE,
        derivationPath: BIP32_DERIVATION_PATH,
      },
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
    pageTitle: `${props.patp} Management Seed`,
  }];

  return page;
};








export {
  MasterTicketComponent,
  MasterTicketShardsComponent,
  AddressManifestComponent,
  SpawnSeedComponent,
  VotingSeedComponent,
  ManagementSeedComponent,
}
