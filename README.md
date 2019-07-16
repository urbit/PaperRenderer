# PaperCollateralRenderer

[Github](https://github.com/urbit/PaperCollateralRenderer)

`PaperCollateralRenderer` generates PNG wallets that can be printed from [keygen-js](https://github.com/urbit/keygen-js). The layouts and static text content exist in Figma, and are imported via the LayoutGenerator component. This JSON is then saved to disk and bundled with the `PaperCollateralRenderer` and `PageRenderer` for prod. The layout objects contain variable strings like `@heading` or ``` @management.seed.length ```. `PaperCollateralRenderer` replaces these with real data. Variables can also specify special layout components like `>sigil:@patp`.


## Install

Install deps via npm:

```
$ npm install
```


## Build

| Commands             | Description                                   |
| -------------------- | --------------------------------------------- |
|`$ npm run build:prod`| Build the library from source                 |
|`npm run build:dev`   | Run the development testing page              |
|  or `npm run start`  |                                               |
|`npm run serve`       | Serve build on localhost:8000                 |  

"convert": "node convert.js",
"start": "gulp watch",
"build:dev": "gulp",
"build:prod": "gulp bundle-prod",
"serve": "python -m SimpleHTTPServer 8000"

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

|Prop Name              | Description                                  | Type
| -------------------- | --------------------------------------------- | -----
| `wallet`   | A wallet in the format below                             | Transformed keygen-js wallet object
| `className`| A class on the outer component div tag                     | `string`
| `callback` | A function to call when all PNGs have been generated | `function`
| `mode`     | Allows you to select a preset collection of PNGs to generate   | `string`, currently 'REGISTRATION' is the only option.


#### Sample Wallet Input
More sample wallets can be found in [src/sampleWallets](https://github.com/urbit/PaperCollateralRenderer/tree/master/src/sampleWallets)

```json

{
  "0": {
    "ticket": "~radlud-tagset-fidrec-narrym-tadrud-patlup-magnyd-mismet-ranlyx-passun-napfeb-haldux-fannec-simpex-bistud-ramwyl-bansud-dibnym-todmes-tamtuc-finrup-mocfur-rantug-savfep",
    "shards": [
      "~radlud-tagset-fidrec-narrym-tadrud-patlup-magnyd-mismet-ranlyx-passun-napfeb-haldux-fannec-simpex-bistud-ramwyl",
      "~ranlyx-passun-napfeb-haldux-fannec-simpex-bistud-ramwyl-bansud-dibnym-todmes-tamtuc-finrup-mocfur-rantug-savfep",
      "~radlud-tagset-fidrec-narrym-tadrud-patlup-magnyd-mismet-bansud-dibnym-todmes-tamtuc-finrup-mocfur-rantug-savfep"
    ],
    "ownership": {
      "meta": {
        "type": "ownership",
        "revision": 0,
        "ship": 0
      },
      "seed": "piece female marriage among close talk smile refuse royal snack fish age ivory oak hundred food test person rubber flame manual question grab useful",
      "keys": {
        "public": "0277c51d2e57e3e4de09b7a99b8649ee28f5523f9652422783365274cefea1e657",
        "private": "5018bc4cf165e72d813262d2487f354ac700993dd2f586eb974ab9b5fba16aae",
        "chain": "16b0794bb5d8a6fcb8fb4ad6bd515a0e1db0acf7f38ff46c5ba51691f2b92085",
        "address": "0x8E26495878D124F0336cA08d32caeE4636d54aD8"
      }
    },
    "transfer": {
      "meta": {
        "type": "transfer",
        "revision": 0,
        "ship": 0
      },
      "seed": "party vote circle puzzle still oil diary coil six suggest tackle identify write tennis mutual chuckle outdoor spell drive degree feel anxiety erosion cram",
      "keys": {
        "public": "03755d256efde2cf5d4c94a0bdd4a563f4725dbb8cbeb5d261609df34909dbbb8f",
        "private": "9d9b09b8775335dcccca8ec93e7df06fbe73392b73a8f658fffa1a33a1dd18c8",
        "chain": "b0183eec9be21456997802110733db15fe1facaceac8ad23076276dc5d210e80",
        "address": "0xd4210763E9B896D1b6DF6694f2B0E2bE412F60eA"
      }
    },
    "spawn": {
      "meta": {
        "type": "spawn",
        "revision": 0,
        "ship": 0
      },
      "seed": "begin host casual trick old ten post van double doll lamp true divert soul legend health scout ball bicycle cause proof produce lazy around",
      "keys": {
        "public": "0396c76a075e14b119d2eb7ca145c9bace7d19ef4d19ebfd6f497321c1e9eb036c",
        "private": "6d3b9f5b97121ec8ac08883e998c3f148249828ac46312d0cb632bc6a4488997",
        "chain": "00b2b8389db871b7fab7741a12da4cd08c3d024e61b3499e3fb79d37f14970ee",
        "address": "0xCc61160fbFb525D05Cfadec593b7efE0942d8C70"
      }
    },
    "voting": {
      "meta": {
        "type": "voting",
        "revision": 0,
        "ship": 0
      },
      "seed": "desert drip apart shine fit minor video virus occur village day drum please budget stairs nurse camera siren art crash order abstract flight sorry",
      "keys": {
        "public": "02258e4911920263b004e9acaed2fb1ab0d67e14aa00e46cc02ee27d4cb99a32de",
        "private": "e082549c14041f82e6951a159ab8104d0ee1f72f89429144b9d05756fa60a06b",
        "chain": "fa2706de1ae58ac392d7c2ec319d7a407eeaed3530765bc4d5de2cb838e451d8",
        "address": "0x6871d0A54F9571880Ca5766d9598401c060C1C3f"
      }
    },
    "management": {
      "meta": {
        "type": "management",
        "revision": 0,
        "ship": 0
      },
      "seed": "lonely sheriff erase develop opinion wine adjust junk text target similar host select cram impulse traffic setup right clarify mention buddy divert flame correct",
      "keys": {
        "public": "02c7ddd314753edbc70e6db79600d2d4d4eb8b1a0cece3d1cabaacc96f3ab7e323",
        "private": "bf56391aa4e9b96dd2b377d539fcc69cf6e64a7283a9a338d6c3a25d8d657973",
        "chain": "a0c2eedbed67616b5675b4ef130b19ecee5ac5051c06c17e697bd69dd287a2c5",
        "address": "0x8a1305D001cB6D97d1D56aE674FBb9C3a374122F"
      }
    },
    "network": {
      "seed": "399b13377cae00528830d71a23473e2c99c5bb0f7fdf04407fd8a3afab854792",
      "keys": {
        "crypt": {
          "private": "db2aeb62878870ba37a8d0a210627a5ae6d70b66a1adbd79e8eb700dcba511c8",
          "public": "c431b44368894044457cd518ffc5c10a28c794b616dabdc1e44250c03deb9ac7"
        },
        "auth": {
          "private": "f2a870f2ae6a86a510e04695a94d0f4ac4820a5d5f8be5652890a461d0314977",
          "public": "53dab594e8073c9ab9ebcb9f7b4aa05295f0a47aadd2deafe8bc2cbe76fb16b7"
        }
      },
      "meta": {
        "type": "network",
        "revision": 0,
        "ship": 0
      }
    }
  },
  "1000": {
    "ticket": "~haddus-witmud-finfun-danben-hinhes-hantyc-wollyn-hostug",
    "shards": [
      "~haddus-witmud-finfun-danben-hinhes-hantyc-wollyn-hostug"
    ],
    "ownership": {
      "meta": {
        "type": "ownership",
        "revision": 0,
        "ship": 1000
      },
      "seed": "visa enforce deer sample clarify cactus few heart bronze index roast essence cream donkey arctic draw main federal then vanish proof churn sell gorilla",
      "keys": {
        "public": "036a7c0095dd2d5e0bee1bea28ab2b0a0f84c770d298fb31a1d69a1f1d3776f1eb",
        "private": "8a9eaeb914599231c0d866f96fca2c89f40b6919a46ad9105b2af87c6baa5d33",
        "chain": "1698146aada5742baaf76ac90b583299fc31bc5e95ea75c606c4a9cbcbc94e61",
        "address": "0xdD7f3Ad5d5a2933272316035ec9655d5F1eE72Ad"
      }
    },
    "transfer": {
      "meta": {
        "type": "transfer",
        "revision": 0,
        "ship": 1000
      },
      "seed": "gain drop muscle brick pitch deliver peanut man insect reflect federal hotel siege brain fabric eagle nuclear cotton help arena wife merit recall glove",
      "keys": {
        "public": "0357ab53cee09e08e83cd6a2c5df2afe1a58e7c6bbf3f2a38126f9ae2d9a1c0a46",
        "private": "0acc55a28025142a771c5815bcbd35d094007510e5a6acc2aa4da47ce5d9f7ba",
        "chain": "e1fd1575ca9bfc736fa7f74dff96cee4652780febb70e63ed857d36bd1632c7f",
        "address": "0xD1fBdbBCe6E88B729d77152584C02f980f1551b1"
      }
    },
    "spawn": {
      "meta": {
        "type": "spawn",
        "revision": 0,
        "ship": 1000
      },
      "seed": "quit dawn alien palm eight earn zebra have spin attitude end foam grit keep remove over laugh practice open buyer cancel verify subject client",
      "keys": {
        "public": "020c3fb80d12372a7f6da41a125a6702c4f47b859834c62c5aa9d4f2e8be106fd4",
        "private": "4d3b95e7855ac080179ccece414483fdd74ac166535e175daee735816022c9f9",
        "chain": "23398363a7443fd34a76f21aec7e5c5b09a2325d7b0ff4622cb88a033edcad0e",
        "address": "0x444115d1C81D450e5F6E094a2D9fb7bf85e422BF"
      }
    },
    "voting": {},
    "management": {
      "meta": {
        "type": "management",
        "revision": 0,
        "ship": 1000
      },
      "seed": "fury antenna clog crane amazing erosion random impulse script elephant poet divorce velvet vintage idea rib uncle glad crater garment aisle usual aunt sword",
      "keys": {
        "public": "036db7b1f8a27cf9a6bb2b5e5a5c8988010d8551edf858e4ea4cf3b098e81dc64c",
        "private": "207e75a6070bc3af022f6879cbad2b3362f1505f9e44cf7c526e717aa36de320",
        "chain": "46feb422061ec87148286d703fe7dd0ce2cbe951af9b18fc2e23db59b97abafa",
        "address": "0xCB4cA7Eaad5D16B812A31d6B879fA9b821E327eC"
      }
    },
    "network": {}
  },
  "80000": {
    "ticket": "~difsyn-dorper-fopten-fadrus",
    "shards": [
      "~difsyn-dorper-fopten-fadrus"
    ],
    "ownership": {
      "meta": {
        "type": "ownership",
        "revision": 0,
        "ship": 80000
      },
      "seed": "fat buffalo economy suspect unveil canoe timber viable pen client jazz pencil eye emotion sight deputy emotion nest hat resemble lawsuit pride poet woman",
      "keys": {
        "public": "0218dea99b0e44714aec7a7c741af4995c2ef357ef219d6955b8ed2b3c34ab0330",
        "private": "5e6ed3573af3aeb38ab92689c49c95329eff8f2505ece5983f9f20be2d5901f5",
        "chain": "2f3f3bce2c59fa78da22f7711be88368215caf0d9daf7e89114700061918ab76",
        "address": "0x2a05774E1AB5A5ACDa681271B643D4Db39b6895e"
      }
    },
    "transfer": {
      "meta": {
        "type": "transfer",
        "revision": 0,
        "ship": 80000
      },
      "seed": "fluid grace letter shrimp release quit master muscle sweet peace nominee garment join dumb abstract fruit nation corn visa tackle air stomach filter okay",
      "keys": {
        "public": "0277acf5b3af6b9d469a11ecd7d447d03f6ceedcf9021bc9d31ca754959acf4fe8",
        "private": "43956a8f0c3a533dc6bb2dc2aa341dd88e1155702600282e1d3dc5b4d329a69c",
        "chain": "d8968530cc45d322c4b78f95ce6582cb4870a553013d286f88e13f2b4e22f9d0",
        "address": "0x882eFb74B494CDC2805642428F912F5A3FF8d25c"
      }
    },
    "spawn": {
      "meta": {
        "type": "spawn",
        "revision": 0,
        "ship": 80000
      },
      "seed": "library setup roof myth fringe fitness urge model night process warm stool stable reveal punch pony scale soup lizard accuse park consider task large",
      "keys": {
        "public": "0276eb46ef7b1918a064e9361de342853be1b417aaacad5f5446e2492907f6dcba",
        "private": "84c69e871a04761d364583ed40e9a0fd91bf558390730a4a32da4d19b6f178c6",
        "chain": "8566618359c24bc4be7eeca379c96c503c59ac78f538b4cbd5be2eb80259d48d",
        "address": "0xC42C9861f03b76238f5B38a0b61aA93471db1B77"
      }
    },
    "voting": {},
    "management": {
      "meta": {
        "type": "management",
        "revision": 0,
        "ship": 80000
      },
      "seed": "reunion heavy alert phrase aunt ecology street web rotate aerobic success basket cliff sail canoe rescue alone lumber spread subject gospel tired vital peasant",
      "keys": {
        "public": "03466a6d09c48457cbfb0c5094c99fb3d6925681969075dd0050b3167bc3ff8433",
        "private": "34870c7d92f8c63b743731d1db310900d2c38575390a1b5c1664961118b8a1c0",
        "chain": "983ece9519cb47e559eb97d09b826c42be0de39c121e532931fdcb61a41ea7f3",
        "address": "0x8c794e5a8F2B82B4A647B8b602FB662A284eAC44"
      }
    },
    "network": {
      "seed": "a2405d4c8a86048004e5af21d8f2a6693918ddf22f5a0bffac9e1b4bef4740c0",
      "keys": {
        "crypt": {
          "private": "303a1e9d961bc1de138c1e1e4113ceac25e96fe515ef6b21efb338d3e83af2dc",
          "public": "dded83b96c98702d1cbd10f17625ef215890777abd6396f6d7fd4bcb9279c451"
        },
        "auth": {
          "private": "13ab43b79da0e315df6c1cb10076fdd509521d2f17e13edf0672557f9f4b503c",
          "public": "27ea9829156690817d0d65c6a131333ceaec5f694846698ea1bdc2ce4da625fe"
        }
      },
      "meta": {
        "type": "network",
        "revision": 0,
        "ship": 80000
      }
    }
  }
}


```
