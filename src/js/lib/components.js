import flatten from 'flat';
import { getTicketSize } from './utils';

import {
  values,
  match,
  replace,
  toUpperCase,
} from './reset';

import {
  dateToDa,
  shortDateToDa,
  retrieve,
  getCustodyLevel,
  getTitleByClass,
  shim,
  assignBin,
  mapInsert,
} from './utils';

import { loadImg, loadQR, loadSigil } from './load';

const BIP32_DERIVATION_PATH = `m/44'/60'/0'/0/0`;
const AT_LOAD_QR_SIZE = 100;
const AT_LOAD_SIGIL_SIZE = 100;
const AT_LOAD_ICON_SIZE = 20;
const PAT = /(\@)/g;
const KEY_ICON_DATA = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAlCAYAAADsmd+EAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANRSURBVHgB7Zo9dtpAEMcHQR9yA6VzF3ICixvgMpXxCey0fnyIjz64Swd06eKUqSJOEN0gSpd0zgGA/EesFCHtygILmZX5vaeHnnYlpL9mNLOzW6E9ub29bVSr1UalUjGxveJj6/X6L7YHbG6tVnNt236gklLZpXOn07EgVh+7DWz1DKc4q9VqjnMciOhRicgk3GAwuIYANmUTS8UMljkoi4CpwuEhG3C7j9i1KB88vIDBaDSakeZUVQ1sZRBtht0zyo86rK5lWVZ9sVh8I42RWhxE6wvXPCT3EPFK1wBSix8oSDSmBYvm3wvSkC1XRdRswQo+UXGc6eq2oavCZUxYwHfsmlQwy+WyOR6PHdIII9iBaJyfmY/0d9DvjtMKyhHkeVO8uKekOoXjW5ywtp/KThuhJsGH/LH+h8QwjHa/35/L2kT6NMX9XqjyRZw7xU+b0vFwjWZazulbnLA21QXe2RuOIvohcM0QwC7jx4Vo/Knxf/nlxvtkFI0xVdcICFy1JWkLVHfpyGDxer1e+LIjogXunnjwHUQj1TWiVDiS4hvzJdGwybFmspOe01Wj4B5suO7XmGhR/JcvPKpN+yF1W/yvYUk6OyrRjgk8kJ0iGsMv+AftL1pwjYTlGfjzt5S8oTvSh/oT27OQEI+/cWa8Fzrc04k4W+LJhPPohIpQPEPSWNqqbU6weFOZcFpl8M8AR9krFs6LNZi6DX8KJExNWLhEgotBd4tOxNnK5wz46694D+R2l3QiSiIJ5gRYlnpY3W73hk4w8pEDDjgkiaQQtM9jQHrZKKskflRVjBTqnLPA8tr0MnFFZciTNQZzDhNs15RMReqwvCkqC+cIGPMDV2k9Oh48UdNT5rTR0rmdUpcLL0j/o3CekddDje0NaUR0loutjqOpmdLfpAPMSfB3hDQjHDmwWbJ5UsFDLli5lssitqYHHcf53Ww2/1C+bqiERRsOhzZpSGIJBMRzIR4nxQcVT2fRGOWiG1HH55K6SfnzAcFgQhqjXHQj3Jbr+a/x7csrEebc6D1E+0yak2l9HKzPEqmKRfvhibVxMyoJO63I5MonpuZuIMI5bVZlpsHRmVckzcWwrlTsJFwUUbPzl7RiVBGOODDVyIK5OqYYu/APFvmht/y+ZBwAAAAASUVORK5CYII=`;


const MasterTicketComponent = async (wallet, constants, templates) => {
  const KEY = 'masterTicket';
  const TEMPLATE = `MASTER_TICKET:${retrieve(wallet, 'ship.class').toUpperCase()}`
  const props = {
    heading: 'Master Ticket',
    patp: retrieve(wallet, 'ship.patp'),
    patp_azimuth: `${retrieve(wallet, 'ship.patp')}.azimuth.network`,
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
      createdOn: shortDateToDa(new Date()),
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
      custodyText: `This requires a ${getCustodyLevel(retrieve(wallet,'ship.class'))} Friction Custody. Securely store this document. If you lose your master ticket and ship name, there is no way to recover it and you will no longer able to control your identity.`,
    },
    keyIcon: await loadImg(KEY_ICON_DATA, img => img),
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };
  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    collateralType: props._type,
    bin: assignBin(props._classOf, props._type),
    pageTitle: `${props.patp} Master Ticket`,
    ship: props.patp,
  }];

  return page;
}




const MasterTicketShardsComponent = async (wallet, constants, templates) => {
  const pages = await wallet.shards.map(async (shard, index) => {
    const KEY = `masterTicketShard_${index + 1}`;
    const TEMPLATE = `MASTER_TICKET_SHARD:${retrieve(wallet, 'ship.class').toUpperCase()}`;
    const props = {
      patp: retrieve(wallet, 'ship.patp'),
      sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
      shard: {
        number: `MASTER SHARD ${index + 1}`,
        data: shard,
        size: `OF ${wallet.shards.length}`,
        ticketSize: getTicketSize('masterTicketShard', retrieve(wallet, 'ship.class')),
      },
      ownership: {
        ethereum: {
          address: retrieve(wallet, 'ownership.keys.address'),
          qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'ownership.keys.address')),
        },
        seed: {
          mnemonic: retrieve(wallet, 'management.seed'),
          derivationPath: BIP32_DERIVATION_PATH,
        },
      },
      meta: {
        custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
        custodyText: `This requires a ${getCustodyLevel(retrieve(wallet,'ship.class'))} Friction Custody. Securely store this document. If you lose your master ticket and ship name, there is no way to recover it and you will no longer able to control your identity.`,
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






const ManagementComponent = async (wallet, constants, templates) => {
  const KEY = 'masterTicket';
  const TEMPLATE = `MANAGEMENT:${retrieve(wallet, 'ship.class').toUpperCase()}`
  const props = {
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    ticket: {
      data: retrieve(wallet, 'ticket'),
    },
    management: {
      seed: {
        mnemonic: retrieve(wallet, 'management.seed'),
        derivationPath: BIP32_DERIVATION_PATH,
      },
      ethereum: {
        address: retrieve(wallet, 'ownership.keys.address'),
        qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'ownership.keys.address')),
      },
    },
    meta: {
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
      custodyText: `This requires a ${getCustodyLevel(retrieve(wallet,'ship.class'))} Friction Custody. Securely store this document. If you lose your master ticket and ship name, there is no way to recover it and you will no longer able to control your identity.`,
    },
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };
  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    collateralType: props._type,
    bin: assignBin(props._classOf, props._type),
    pageTitle: `${props.patp} Master Ticket`,
    ship: props.patp,
  }];

  return page;
}









const MultipassComponent = async (wallet, constants, templates) => {
  const KEY = 'multipass';
  const TEMPLATE = `MULTIPASS`;
  const props = {
    heading: 'Multipass',
    patp: retrieve(wallet, 'ship.patp'),
    patp_azimuth: `${retrieve(wallet, 'ship.patp')}.azimuth.network`,
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    ownership: {
      ethereum: {
        address: retrieve(wallet, 'management.keys.address'),
        qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'management.keys.address')),
      },
    },
    meta: {
      createdOn: shortDateToDa(new Date()),
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



const SpawnComponent = async (wallet, constants, templates) => {
  const KEY = 'spawn';
  const TEMPLATE = `SPAWN:${retrieve(wallet, 'ship.class').toUpperCase()}`;
  const TITLE = 'SPAWN PROXY'

  const props = {
    heading: TITLE,
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    spawn: {
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
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
      custodyText: `This requires a ${getCustodyLevel(retrieve(wallet,'ship.class'))} Friction Custody. Securely store this document. If you lose your master ticket and ship name, there is no way to recover it and you will no longer able to control your identity.`,
    },
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };

  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    collateralType: props._type,
    bin: assignBin(props._classOf, props._type),
    ship: props.patp,
    pageTitle: `${props.patp} ${TITLE}`,
  }];
  return page;
};






const TransferComponent = async (wallet, constants, templates) => {
  // console.log(wallet);
  const KEY = `TRANSFER:${retrieve(wallet, 'ship.class').toUpperCase()}`;
  const TEMPLATE = `TRANSFER:${retrieve(wallet, 'ship.class').toUpperCase()}`;
  const TITLE = 'TRANSFER PROXY'

  const props = {
    heading: TITLE,
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    transfer: {
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
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
      custodyText: `This requires a ${getCustodyLevel(retrieve(wallet,'ship.class'))} Friction Custody. Securely store this document. If you lose your master ticket and ship name, there is no way to recover it and you will no longer able to control your identity.`,
    },
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };

  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    collateralType: props._type,
    bin: assignBin(props._classOf, props._type),
    ship: props.patp,
    pageTitle: `${props.patp} ${TITLE}`,
  }];
  return page;
};







const VotingComponent = async (wallet, constants, templates) => {
  // console.log(wallet);
  const KEY = 'voting';
  const TEMPLATE = `VOTING:${retrieve(wallet, 'ship.class').toUpperCase()}`;
  const TITLE = 'VOTING PROXY'

  const props = {
    heading: TITLE,
    patp: retrieve(wallet, 'ship.patp'),
    sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
    voting: {
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
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
      custodyText: `This requires a ${getCustodyLevel(retrieve(wallet,'ship.class'))} Friction Custody. Securely store this document. If you lose your master ticket and ship name, there is no way to recover it and you will no longer able to control your identity.`,
    },
    _classOf: retrieve(wallet, 'ship.class'),
    _type: KEY,
    _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
  };

  const page = [{
    renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
    collateralType: props._type,
    bin: assignBin(props._classOf, props._type),
    ship: props.patp,
    pageTitle: `${props.patp} ${TITLE}`,
  }];
  return page;
};

export {
  MasterTicketComponent,
  MasterTicketShardsComponent,
  ManagementComponent,
  MultipassComponent,
  SpawnComponent,
  TransferComponent,
  VotingComponent,
}
