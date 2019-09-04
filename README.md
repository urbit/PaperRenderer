# PaperRenderer

[![Version](https://img.shields.io/npm/v/urbit-paper-renderer.svg)](https://www.npmjs.com/package/urbit-sigil-js)
![Minzipped Size](https://badgen.net/bundlephobia/minzip/urbit-paper-renderer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[→ Github Repo](https://github.com/urbit/PaperRenderer)

[→ Latest Figma Doc](https://www.figma.com/file/2Lh4E8LguPxidqNGKGxr1B/Tlon-Paper-Wallet-2.0?node-id=1640%3A35214)

[→ On NPM](https://www.npmjs.com/package/urbit-paper-renderer)

## Overview

Urbit identities are cryptographically owned, which means the possession of an identity is based on the possession of a keypair. We have our own keypair scheme ([UP8](https://github.com/urbit/proposals/blob/master/008-urbit-hd-wallet.md)) that categorizes activities related to your identity and assigns them to different keypairs, all derived from a root key called a Master Ticket. Since possession of these keypairs is fundamental to owning your Urbit identity and this cryptographic property is secret, we recommend appropriate cryptographic property storage best practices and do our best to improve the convenience and ease of maintaining secure custody of these assets. This recommendation includes the use of printed paper wallets. This is a browser-based JS library for generating these wallets.

## Usage

`<PaperRenderer/>` is a React component that generates PNG wallets that can be printed from [urbit-key-generation](https://github.com/urbit/urbit-key-generation). The layouts and static text content exist in Figma, and are imported via the `convert.js` script. This JSON is bundled with `PaperRenderer` in release. The layout objects contain variable strings like `@heading` or `@management.seed.length`. `<PaperRenderer/>` replaces these with real data. Variables can also specify special layout components like `#sigil@meta.patp` or `#ethereumAddress@management.keys.address`.

**FONTS MUST BE PROVIDED AND LOADED APPLICATION-SIDE. FONTS WILL NOT RENDER IF THEY ARE NOT LOADED.**

### Install

```
$ npm install urbit-paper-renderer
```

### Examples

```js
import PaperRenderer from 'PaperRenderer'
;<PaperRenderer
  // `wallet` is a wallet generated by the urbit-key-generation library.
  wallets={[wallet]}
  callback={(data) => console.log(data)}
/>
```

Output

```js
[{
  frames: {...}, // template pages with `img` property
  wallet: {...}  // extendedWallet
}]
```

### Props

| Prop Name   | Description                                          | Type                                        |
| ----------- | ---------------------------------------------------- | ------------------------------------------- |
| `wallet`    | A wallet in the format below                         | Transformed keygen-js wallet object         |
| `className` | A class on the canvas element                        | `string`                                    |
| `callback`  | A function to call when all PNGs have been generated | `function`                                  |
| `show`      | show or hide the canvas element                      | `bool`, default `false`                     |
| `debug`     | draw layout grid lines                               | `bool`, default `false`                     |
| `output`    | output image format                                  | `string`, `'png'` or `'uri'`, default `png` |
| `verbose`   | include input in output                              | `bool`, default `false`                     |

### Dependencies

We try to keep runtime dependencies to a minimum.

###### dependancies

- `lodash.get`
- `urbit-sigil-js`
- `prop-types`
- Fonts \* See Font Notes Below
  - Inter 600
  - Inter 500
  - Inter 400
  - Source Code Pro 500
  - Source Code Pro 400

###### peerDependancies

- `urbit-key-generation ^0.7.0`

###### devDependencies

- See `package.json`

## Development

This library has two main parts. One is the JS that lives in this repo. The other is a document in Figma which specifies the page layouts – x/y coordinates, widths/heights, color, font properties and static text data. The advantage of this that making design changes and tweaks is fairly trivial. The disadvantage is that there is one more domain to debug in.

### Figma-side

The output frames are assembled in the `Release 2.0` page, and the Figma components live in `Components 2.0`. We make precise use of Figma components to tightly control the sources of input data to each dynamic part of the paper wallets. An example of this can be found in the seed components, where we start with a generic component that defines the layout and style, and end with a wrapper component that includes a special title which includes text like `@ownership.seed`. This path follows the structure of the Urbit HD wallet JSON, including a few new paths for data and assets that this JS library adds, like sigils.

#### Schema

Dynamic elements must be named according to the following schema:

```
#validComponentName@valid.path.to.data.in.extended.wallet
```

#### Adding new components

Figma-side, adding a new dynamic element is as simple as using the `#validComponentName` and path to a text element. JS-side, you will have to tell the library about it in a few places, including:

`tools/component.js` is used to convert the Figma API JSON to a data structure that is easy to iterate through.

`lib/src/lib/draw.js` is used to draw to the internal `<canvas/>` element.

#### Reminders and Rules

- Don’t use any Advanced Type Figma features, such as transforming to all caps. The text rendering in this lib doesn't support these features.

- Each text box can only have 1 font weight, font size, etc. Again, complex text rendering is not supported at this time.

- Text boxes should be as long as possible so that in the case Times New Roman is rendered, the line does not carriage return and overflow onto lines below, which could obfuscate a private key. This bug is evidence of improper consumer-side implementation.

- If the text is an email, like support@urbit.org, the textbox element will have to be renamed so that it isn’t accidentally read by PaperRenderer as a path.

- Don't use colors other than black, white and 50% gray. Users may not have access to high-quality printing.

- It is important to keep the Figma Components well-organized. Validating the accuracy of these components is part of debugging and QA. Keeping them well organized reduces complexity and has a direct effect on reliability.

#### Pointing to new data

The following are the valid data targets in the extendedWallet object. The use of other paths will cause an error. If you want to add more information to the extendedWallet, you’ll need to do so in `index.js` of PaperRender, inside the extendWallet method. And don’t forget to update this list. (Aug 29 2019)

```
"meta.generator",
 "meta.ship",
 "meta.patp",
 "meta.tier",
 "meta.derivationPath",
 "meta.passphrase",
 "meta.sigilDark",
 "meta.sigilLight",
 "meta.azimuth.url",
 "meta.renderer.version",
 "meta.renderer.name",
 "meta.dateCreated",
 "ticket",
 "shards.0",
 "shards.1",
 "shards.2",
 "ownership.type",
 "ownership.seed",
 "ownership.keys.public",
 "ownership.keys.private",
 "ownership.keys.chain",
 "ownership.keys.address",
 "transfer.type",
 "transfer.seed",
 "transfer.keys.public",
 "transfer.keys.private",
 "transfer.keys.chain",
 "transfer.keys.address",
 "spawn.type",
 "spawn.seed",
 "spawn.keys.public",
 "spawn.keys.private",
 "spawn.keys.chain",
 "spawn.keys.address",
 "voting.type",
 "voting.seed",
 "voting.keys.public",
 "voting.keys.private",
 "voting.keys.chain",
 "voting.keys.address",
 "management.type",
 "management.seed",
 "management.keys.public",
 "management.keys.private",
 "management.keys.chain",
 "management.keys.address",
 "network"
```

### Library-side

Everything library-side is geared towards making the drawing iteration step as simple as possible while exposing in-code interfaces for tweaks, changes and extensions. Things happen in this library linearly.

0. The processed frame templates are generated development-side, and bundled with the library for release.

1. Extend the input wallet(s) with asynchronously loaded assets like images and sigils and other dynamic metadata like date and PaperRenderer version.

1. Create a standard data structure that flows through the library. In this case, it is a pair of wallet and frame. This means that the wallet is copied a lot, but we don't care because it reduces flow complexity, and ensures all data is always available during the next step.

1. Insert data from the extendedWallet into the frames by following the `@path` specified in Figma.

1. Iterate through pages and their elements. Draw each element on the internal canvas based on the `#component` part of the element's title, specified in Figma.

1. Append the images to the frame objects.

1. Return the extendedWallet and new frames.

#### Organization

`lib/src/lib/draw`
functions that draw dynamic elements to the canvas. Specified by `#component` syntax in Figma.

`lib/src/lib/load`
Functions that load images and other assets like sigils.

`lib/src/lib/utils`
Misc helper functions

`lib/src/index`
The main library source

`lib/src/templates`
The output of convert. The processed output of the Figma API.

`lib/dist`
The bundled builds

`tools/component`
Functions used to get convert elements from Figma API document data into a lower impedance data structure for the library.

`tools/convert`
The main script that calls the Figma API and outputs the templates.json to `lib/src`

`tools/genWallet`
Generates wallets for testing

`preview/`
Source and build for a website we use to develop and validate the library

#### Debugging

See [Frequent Bugs](https://github.com/urbit/PaperRenderer/blob/master/docs/freq-bugs.md)

#### Sample QA Release Checklist

- [ ] Run convert
- [ ] Build the library
- [ ] Run programmatic tests
- [ ] All expected pages are generated
- [ ] all pages have correct custody information
- [ ] all pages have correct loss information
- [ ] all pages have correct usage information
- [ ] all pages have correct metadata
- [ ] all paths resolve to correct data, referenced between json wallet and printed wallets or default text
- [ ] font-families are correct in preview
- [ ] All visual elements are accounted for
- [ ] color is correct in preview
- [ ] font weights are correct in preview

### Font Notes

Browsers load fonts separately from the rest of the page. This means that if you have an application that loads Inter 400 but not Inter 500, Inter 400 text will render on the canvas, but Inter 500 will not and may either render as Times New Roman or not appear at all.

One way to ensure that the browser loads all fonts is to include the font data as base64 in the HTML document itself, inside a style tag.

Base64 encoding fonts is easy, but the resulting data is large and difficult to move around in a text editor.

### Miscellaneous

- The derivation path is omitted because it is mentioned in the wallet UP ([UP8](https://github.com/urbit/proposals/blob/master/008-urbit-hd-wallet.md))

### Authors

- ~davpub-habrut
- ~ridlur-figbud

### Contributing

Please read [CONTRIBUTING.md](https://github.com/urbit/sigil-js/CONTRIBUTING.md) for details on the process for submitting pull requests to us.

### License

This project is licensed under the MIT License - see the [LICENSE.txt](docs/LICENSE.txt) file for details
