# PaperRenderer

🚧 Library under construction, use branch `rc-immediate` for working release. 🚧

[→ Github](https://github.com/urbit/PaperRenderer)

[→ Figma](https://www.figma.com/file/a4u6jBsdTgiXcrDGW61q5ngY/Tlon-Paper-Wallet-v1.2?node-id=574%3A0)

[→ NPM](https://www.npmjs.com/package/urbit-paper-collateral-renderer)

`PaperRenderer` generates PNG wallets that can be printed from [urbit-key-generation](https://github.com/urbit/urbit-key-generation). The layouts and static text content exist in Figma, and are imported via the `convert` script. This JSON is then saved to disk and bundled with `PaperRenderer` in release. The layout objects contain variable strings like `@heading` or `@management.seed.length`. `PaperRenderer` replaces these with real data. Variables can also specify special layout components like `#sigil@meta.patp`.

## Dependencies

**FONTS MUST BE PROVIDED AND LOADED APPLICATION-SIDE. FONTS WILL NOT RENDER IF THEY ARE NOT LOADED.**

### Fonts

- Inter UI 500
- Inter UI 400
- Source Code Pro 500

### dependencies

- lodash.get
- urbit-sigil-js

### peerDependancies

- urbit-key-generation ^0.7.0

### devDependencies

- See package.json

## Install

Install deps via npm:

```
$ npm install
```

## Build

How to build/run for development:

0. Create a `.env` file in the root directory. Paste in Tlon's Figma API token like the following:

`FIGMA_API_TOKEN="your-token-here-within-the-quotes"`

1. `npm run convert` translates the Figma design to JSON via the Figma API. You can target a specific Figma document by updating the document string and page name that are found in [convert.js](https://github.com/urbit/PaperRenderer/blob/c51c80e0e5895142b41ef06d2d48de1357f328f6/convert.js#L32), lines 32 and 34. You can retrieve a Figma document string id by opening the document in your browser and copying the string that appears before the document name. Each document has pages, which you can target with a name string, such as our current page [Registration 1.2](https://www.figma.com/file/a4u6jBsdTgiXcrDGW61q5ngY/Tlon-Paper-Wallet-v1.2?node-id=574%3A0).

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
<PaperRenderer
  wallets={[wallet]}
  className={''}
  show={true}
  debug={false}
  callback={(data) => console.log(data)}
/>
```

`PaperRenderer` has 7 props.

| Prop Name   | Description                                          | Type                                        |
| ----------- | ---------------------------------------------------- | ------------------------------------------- |
| `wallet`    | A wallet in the format below                         | Transformed keygen-js wallet object         |
| `className` | A class on the canvas element                        | `string`                                    |
| `callback`  | A function to call when all PNGs have been generated | `function`                                  |
| `show`      | show or hide the canvas element                      | `bool`, default `false`                     |
| `debug`     | draw layout grid lines                               | `bool`, default `false`                     |
| `output`    | output image format                                  | `string`, `'png'` or `'uri'`, default `png` |
| `verbose`   | include input in output                              | `bool`, default `false`                     |

### Returned Value

Default

```js
[{
  pages: {...}, // template pages with `img` property
}]
```

With verbose on

```js
[{
  pages: {...}, // template pages with `img` property
  templates: {...}, // templates
  wallet: {...} // wallet
}]
#### Sample Wallet Input

Sample wallets can be found in [sampleWallets](preview/src/js/sampleWallets)


## Release Checklist

- [ ] all pages have correct custody information
- [ ] all paths resolve to data, ie are not undefined
- [ ] all paths resolve to correct data, referenced between json wallet and printed wallets
- [ ] font-families are correct in preview
- [ ] color is correct in preview
- [ ] font weights are correct in preview
- [ ] programmatic tests pass
- [ ] library has been built
- [ ] library can accept empty proxy wallet inputs

#### License

This project is licensed under the MIT License - see the [LICENSE.txt](docs/LICENSE.txt) file for details
```
