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
const IMG_DATA = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAlCAYAAADsmd+EAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANRSURBVHgB7Zo9dtpAEMcHQR9yA6VzF3ICixvgMpXxCey0fnyIjz64Swd06eKUqSJOEN0gSpd0zgGA/EesFCHtygILmZX5vaeHnnYlpL9mNLOzW6E9ub29bVSr1UalUjGxveJj6/X6L7YHbG6tVnNt236gklLZpXOn07EgVh+7DWz1DKc4q9VqjnMciOhRicgk3GAwuIYANmUTS8UMljkoi4CpwuEhG3C7j9i1KB88vIDBaDSakeZUVQ1sZRBtht0zyo86rK5lWVZ9sVh8I42RWhxE6wvXPCT3EPFK1wBSix8oSDSmBYvm3wvSkC1XRdRswQo+UXGc6eq2oavCZUxYwHfsmlQwy+WyOR6PHdIII9iBaJyfmY/0d9DvjtMKyhHkeVO8uKekOoXjW5ywtp/KThuhJsGH/LH+h8QwjHa/35/L2kT6NMX9XqjyRZw7xU+b0vFwjWZazulbnLA21QXe2RuOIvohcM0QwC7jx4Vo/Knxf/nlxvtkFI0xVdcICFy1JWkLVHfpyGDxer1e+LIjogXunnjwHUQj1TWiVDiS4hvzJdGwybFmspOe01Wj4B5suO7XmGhR/JcvPKpN+yF1W/yvYUk6OyrRjgk8kJ0iGsMv+AftL1pwjYTlGfjzt5S8oTvSh/oT27OQEI+/cWa8Fzrc04k4W+LJhPPohIpQPEPSWNqqbU6weFOZcFpl8M8AR9krFs6LNZi6DX8KJExNWLhEgotBd4tOxNnK5wz46694D+R2l3QiSiIJ5gRYlnpY3W73hk4w8pEDDjgkiaQQtM9jQHrZKKskflRVjBTqnLPA8tr0MnFFZciTNQZzDhNs15RMReqwvCkqC+cIGPMDV2k9Oh48UdNT5rTR0rmdUpcLL0j/o3CekddDje0NaUR0loutjqOpmdLfpAPMSfB3hDQjHDmwWbJ5UsFDLli5lssitqYHHcf53Ww2/1C+bqiERRsOhzZpSGIJBMRzIR4nxQcVT2fRGOWiG1HH55K6SfnzAcFgQhqjXHQj3Jbr+a/x7csrEebc6D1E+0yak2l9HKzPEqmKRfvhibVxMyoJO63I5MonpuZuIMI5bVZlpsHRmVckzcWwrlTsJFwUUbPzl7RiVBGOODDVyIK5OqYYu/APFvmht/y+ZBwAAAAASUVORK5CYII=`;

const MasterTicketComponent = async (wallet, constants, templates) => {
  const KEY = 'masterTicket';
  const TEMPLATE = `MASTER_TICKET:${toUpperCase(retrieve(wallet, 'ship.class'))}`
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
      createdOn: dateToDa(new Date()),
      custodyLevel: getCustodyLevel(retrieve(wallet,'ship.class')),
    },
    keyIcon: await loadImg(AT_LOAD_IMG_SIZE, IMG_DATA),
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

const ManagementComponent = async (wallet, constants, templates) => {
  const KEY = 'management';
  const TEMPLATE = `MANAGEMENT:${toUpperCase(retrieve(wallet, 'ship.class'))}`;
  const TITLE = getTitleByClass(retrieve(wallet,'ship.class'));

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
    collateralType: props._type,
    bin: assignBin(props._classOf, props._type),
    ship: props.patp,
    pageTitle: `${props.patp} ${TITLE}`,
  }];
  return page;
};






const AddressManifestComponent = async (wallets, constants, templates) => {

  const props = {
    meta: {
      createdOn: dateToDa(new Date()),
      walletVersion: constants.meta.walletVersion,
      // moreInformation: constants.meta.moreInformation,
    },
  };

  const listItems = wallets.map(async wallet => {
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

    const firstPageRenderableListItems = firstListItemData.reduce((acc, props, listItemIndex) => {
      const moved = mapInsert(props, LI_COMPONENT).map(_r => {
        const r = {..._r};
        r.x = _r.x + P1_LIST_START_X;
        r.y = _r.y + P1_LIST_START_Y + (LI_COMPONENT_HEIGHT * listItemIndex);
        return r;
      });
      return [...acc, ...moved];
    }, []);

    const listItemsBySubsequentPage = chunk(subsequentListItemData, LI_TOTAL_X)

    const subsequentPages = listItemsBySubsequentPage.map((page, pageIndex) => {

      const listItemsWithData = page.reduce((acc, props, listItemIndex) => {
        const moved = mapInsert(props, LI_COMPONENT).map(_r => {
          const r = {..._r}
          r.x = _r.x + PX_LIST_START_X;
          r.y = _r.y + PX_LIST_START_Y + (LI_COMPONENT_HEIGHT * listItemIndex);
          return r;
        });
      return [...acc, ...moved];
    }, []);

    return {
      renderables: [
        ...mapInsert({...props, pageAofB: `Page ${pageIndex + 2} of ${pageCount}`}, TEMP_X),
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

// const MultipassComponent = async (wallet, constants, templates) => {
//   const KEY = 'multipass';
//   const TEMPLATE = `MULTIPASS:${toUpperCase(retrieve(wallet, 'ship.class'))}`
//
//   const props = {
//     heading: 'Multipass',
//     patp: retrieve(wallet, 'ship.patp'),
//     azimuthLink: `${patp}.azimuth.network`,
//     sigil: await loadSigil(AT_LOAD_SIGIL_SIZE, retrieve(wallet, 'ship.patp')),
//     ownership: {
//       ethereum: {
//         address: retrieve(wallet, 'management.keys.address'),
//         qr: await loadQR(AT_LOAD_QR_SIZE, retrieve(wallet, 'management.keys.address')),
//       },
//     },
//     meta: {
//       createdOn: dateToDa(new Date()),
//     },
//     _classOf: retrieve(wallet, 'ship.class'),
//     _type: KEY,
//     _bin: assignBin(retrieve(wallet, 'ship.class'), KEY)
//   };
//
//   const page = [{
//     renderables: mapInsert(props, retrieve(templates, TEMPLATE)),
//     bin: assignBin(props._classOf, props._type),
//     collateralType: props._type,
//     ship: props.patp,
//     pageTitle: `${props.patp} Multipass`,
//   }];
//
//   return page;
// };

export {
  MasterTicketComponent,
  ManagementComponent,
  AddressManifestComponent,
  // MultipassComponent,
}
