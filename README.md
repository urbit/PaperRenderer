# PaperCollateralRenderer

🚧 Library under construction, use branch `rc-immediate` for working release. 🚧

[→ Github](https://github.com/urbit/PaperCollateralRenderer)

[→ Figma](https://www.figma.com/file/a4u6jBsdTgiXcrDGW61q5ngY/Tlon-Paper-Wallet-v1.2?node-id=574%3A0)

[→ NPM](https://www.npmjs.com/package/urbit-paper-collateral-renderer)

`PaperCollateralRenderer` generates PNG wallets that can be printed from [keygen-js](https://github.com/urbit/keygen-js). The layouts and static text content exist in Figma, and are imported via the LayoutGenerator component. This JSON is then saved to disk and bundled with the `PaperCollateralRenderer` and `PageRenderer` for prod. The layout objects contain variable strings like `@heading` or `@management.seed.length`. `PaperCollateralRenderer` replaces these with real data. Variables can also specify special layout components like `>sigil:@patp`.

## Install

Install deps via npm:

```
$ npm install
```

## Build

How to build/run for development:

0. Create a `.env` file in the root directory. Paste in Tlon's Figma API token like the following:

`FIGMA_API_TOKEN="your-token-here-within-the-quotes"`

1. `npm run convert` translates the Figma design to JSON via the Figma API. You can target a specific Figma document by updating the document string and page name that are found in [convert.js](https://github.com/urbit/PaperCollateralRenderer/blob/c51c80e0e5895142b41ef06d2d48de1357f328f6/convert.js#L32), lines 32 and 34. You can retrieve a Figma document string id by opening the document in your browser and copying the string that appears before the document name. Each document has pages, which you can target with a name string, such as our current page [Registration 1.2](https://www.figma.com/file/a4u6jBsdTgiXcrDGW61q5ngY/Tlon-Paper-Wallet-v1.2?node-id=574%3A0).

2. `npm run start` builds all files for development and will watch for any JavaScript changes and serve the build on localhost:8000.

3. `npm run build` builds all files for production.

Making changes:

1. If you make changes to your targeted Figma document, you must re-convert the JSON with `npm run convert`.

2. Refreshing the webpage with `cmd+shift+r` will ensure that your browser doesn't render an older, cached version.

| Commands                  | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run convert`         | Import Figma design                   |
| `npm run build:dev`       | Run the development testing page      |
| or `$ npm run build:prod` | Build the library from source         |
| `npm run serve`           | Serve & watch build on localhost:8000 |
| `npm run genWallet`       | Generate random JSON wallets          |

## Debug

See our [documentation of frequent bugs](docs/freq-bugs.md) and how to fix them.

## Usage

```js
<PaperCollateralRenderer
  wallet={wallet}
  className={'extremely-hidden'}
  callback={(data) => console.log(data)}
  mode={'REGISTRATION'}
/>
```

`PaperCollateralRenderer` has four props.

| Prop Name   | Description                                                  | Type                                                   |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| `wallet`    | A wallet in the format below                                 | Transformed keygen-js wallet object                    |
| `className` | A class on the outer component div tag                       | `string`                                               |
| `callback`  | A function to call when all PNGs have been generated         | `function`                                             |
| `mode`      | Allows you to select a preset collection of PNGs to generate | `string`, currently 'REGISTRATION' is the only option. |

#### Sample Wallet Input

[Here](docs/sample-wallet.json) is a sample wallet's JSON. More sample wallets can be found in [sampleWallets](preview/src/js/sampleWallets)

Below is a flattened extended wallet object for reference when making modifications to templates in Figma.

```json
{
  "meta.generator": "urbit-key-generation-v0.16.1",
  "meta.ship": 0,
  "meta.patp": "~zod",
  "meta.tier": "galaxy",
  "meta.derivationPath": "m/44'/60'/0'/0/0",
  "meta.passphrase": null,
  "meta.sigil": {},
  "meta.azimuthUrl": "~zod.azimuth.network",
  "meta.createdOn": "Tue Aug 20 2019 17:04:22 GMT-0700 (Pacific Daylight Time)",
  "ticket": "~zod",
  "shards.0": "~zod",
  "ownership.type": "ownership",
  "ownership.seed": "donkey learn consider decade lunch raise bench jungle devote symbol master element rebuild leaf erode sketch chicken tree stock shell universe verb dilemma aware",
  "ownership.keys.public": "03b934b362f1f56397127d9f302edcb95c60baebfc33c29e204a4d04d4c801d035",
  "ownership.keys.private": "20abf551f3299ed1131806bed91cbcc4c6062933ced5bd92e93804c236811b2b",
  "ownership.keys.chain": "2d12be042d0a750829a5765cef64076eee74775a609e6953dd6e5b2bf0d86509",
  "ownership.keys.address": "0x864FEa342a7558661e9c170989A4B90C74431a3E",
  "ownership.keys.addrQr": {},
  "transfer.type": "transfer",
  "transfer.seed": "yard gym sibling noodle trash maid shuffle fence monkey check toe rain ramp like truck inject situate balcony know embrace pledge ask summer little",
  "transfer.keys.public": "0289a46fb1908ed8ccfd06e1d9402606b85f5e1523f8240d71a7cc0fff0f58dc27",
  "transfer.keys.private": "c85d23d4b84790cbca8c87b50a75e1d8038cea05b182ee9a9a9f105f781cd5a8",
  "transfer.keys.chain": "3b856427bba774576929b973f9b4dddd8920729dbb1e7d978c13fd5b018bebb1",
  "transfer.keys.address": "0x67390AFC640099b24B542aa82F5fBD2526C1619d",
  "transfer.keys.addrQr": {},
  "spawn.type": "spawn",
  "spawn.seed": "absurd gauge meadow gloom snake carbon power nuclear radar twice basket pig evolve occur song cradle wood open luggage else occur monkey wisdom beyond",
  "spawn.keys.public": "030695526bb01ce4acd6e2d8364eb1e84b7ec97fb0492bb948d74ffb18be906779",
  "spawn.keys.private": "8ca4c3e1b9752f7731d0c901e5082c563dbf6b71982875c69a7ef3134b5bb310",
  "spawn.keys.chain": "2fab1c6601452d896ced3638cc621ccd915c6032f4ad75caa6b73ecad63c861f",
  "spawn.keys.address": "0xd17AEC66F51f0469e29D1b3FF8A8316774B9D697",
  "spawn.keys.addrQr": {},
  "voting.type": "voting",
  "voting.seed": "auction bomb shadow eagle inside basic prize used legend help earth lemon unfold fire swallow reject tiger stairs prevent hire lizard shiver result true",
  "voting.keys.public": "03e7758d405f6418dea7558532dca198a73517e224b02eb5d2f60087903912a0f7",
  "voting.keys.private": "dcb26c57387c760ce95f6114d2282eaa5b3fc13a0bb23a5f2d33a8f0fe74bf63",
  "voting.keys.chain": "1158af1324a214b2638bcbc77a787e88eefa8e2ee91534d88bec0702bdf7783e",
  "voting.keys.address": "0xC948Ee31194c1aaf90450a0E0B97c8a6CC3c711A",
  "voting.keys.addrQr": {},
  "management.type": "management",
  "management.seed": "course loan animal skin dish renew inflict wheel hard rural garlic inhale alert pitch easily brick sugar input primary sphere hand roast fall enroll",
  "management.keys.public": "03329fa95ef8048830ba9f67d141814ca1ae2f35c3d9af034b64eb17d6853b4667",
  "management.keys.private": "c2e9eb73afdf8ed393fcb42eab8716ea9002bd911b0645e2918be275ce0ca55f",
  "management.keys.chain": "93c8f1ce629521c18e5e6e5bb8da458fab3cd6ddc6a9a9006fa91e94f60ced6f",
  "management.keys.address": "0x5570a29Fc8E81A21ae6720Ca6803D370E622dF79",
  "management.keys.addrQr": {},
  "network": {}
}
```

#### License

This project is licensed under the MIT License - see the [LICENSE.txt](docs/LICENSE.txt) file for details
