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
  callback={data => console.log(data)}
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

[Here](docs/sample-wallet.json) is a sample wallet's JSON. More sample wallets can be found in [sampleWallets](preview/dist/js/sampleWallets)

#### License

This project is licensed under the MIT License - see the [LICENSE.txt](docs/LICENSE.txt) file for details
