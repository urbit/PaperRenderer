import React, { Component } from 'react'
import { get } from 'lodash'
import flat from 'flat'
import templates from './templates.json'

import { initCanvas } from './lib/utils'

import { loadImg, loadQR, loadSigil } from './lib/load'

const QR_LOADING_SIZE = 100
const SIGIL_LOADING_SIZE = 100

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const sequence = (num) => Array.from(Array(num), (_, i) => i)

// Array.prototype.def = function () {
//   return this;
// };

// We use the Urbit HD wallet for the 'source of truth' for data printed onto the wallet. Here, we generate assets needed for downstream drawing. Most of these involve loading images, which are always loaded asynchronously in a browser environment. We extend the wallet, meaning adding new key/value pairs that contain this new data.
const extendWallet = async (wallet) => {
  if (wallet.meta !== undefined) {
    // load sigil
    const patp = wallet.meta.patp
    const sigil = await loadSigil(SIGIL_LOADING_SIZE, patp)
    wallet.meta.sigil = sigil
  }

  if (wallet.ownership.keys !== undefined) {
    // load address qr codes
    const addr = wallet.ownership.keys.address
    const qr = await loadQR(QR_LOADING_SIZE, addr)
    wallet.ownership.keys.addrQr = qr
  }

  if (wallet.spawn.keys !== undefined) {
    // load address qr codes
    const addr = wallet.spawn.keys.address
    const qr = await loadQR(QR_LOADING_SIZE, addr)
    wallet.spawn.keys.addrQr = qr
  }

  if (wallet.management.keys !== undefined) {
    // load address qr codes
    const addr = wallet.management.keys.address
    const qr = await loadQR(QR_LOADING_SIZE, addr)
    wallet.management.keys.addrQr = qr
  }

  if (wallet.voting.keys !== undefined) {
    // load address qr codes
    const addr = wallet.voting.keys.address
    const qr = await loadQR(QR_LOADING_SIZE, addr)
    wallet.voting.keys.addrQr = qr
  }

  if (wallet.transfer.keys !== undefined) {
    // load address qr codes
    const addr = wallet.transfer.keys.address
    const qr = await loadQR(QR_LOADING_SIZE, addr)
    wallet.transfer.keys.addrQr = qr
  }

  return wallet
}

// In order to only use one shard template, we have to programmatically create new templates for each shard given the number of shards, and index of each one. Doing this is fairly difficult.
const extendShards = (wallet, templates) => {
  // First, we get the shard page template object
  const shardTemplatePage = templates.pages.filter(
    (page) => page.usage === 'shard'
  )

  // we get a number that represents how many shards there are.
  const data = {
    total: wallet.shards.length,
  }

  // we make a place to store the index of each page element that will need to be changed, organized by the type of data that the element expects to recieve.
  const paths = {
    total: [],
    number: [],
  }

  // get the indexes of elements that target shard.data
  paths.number = shardTemplatePage.elements.reduce((acc, elem, idx) => {
    if (elem.path === 'shard.number') {
      return acc.concat(idx)
    } else {
      return acc
    }
  }, [])

  // again, get the indexes of elements that target shard.total
  paths.total = shardTemplatePage.elements.reduce((acc, elem, idx) => {
    if (elem.path === 'shard.total') {
      return acc.concat(idx)
    } else {
      return acc
    }
  }, [])

  // make the new shard page templates based on how many shards there are and insert the data into the `data` property of each target element, targeted by index retieved in the previous steps.
  const extendedShardPages = sequence(shardCount).map(_, (idx) => {
    const shardPageClone = clone(shardTemplatePage)

    paths.total.forEach(
      (path) => (shardPageClone.elements[path].data = data.total)
    )

    paths.number.forEach((path) => (shardPageClone.elements[path].data = idx))

    return shardPageClone
  })

  // get everything but the shard template in order to fully replace the original shard page with the new shard pages with infilled data
  const noShardTemplatePage = templates.pages.filter(
    (page) => page.usage !== 'shard'
  )

  // concat the other pages with the new shard pages
  const newPages = [...noShardTemplatePage, ...extendedShardPages]
  return newPages
}

// Right now, the only extension we do is modifying shards – only do so if the ship is a galaxy and has shards.
const extendTemplates = (wallet, templates) => {
  console.log(wallet.meta)
  // right now, we only offer the shard option for galaxies.
  if (wallet.meta.tier === 'galaxy' && wallet.shards.length > 1) {
    return extendShards(wallet, templates)
  }

  return templates
}

const merge = (templates, wallet) => {
  // console.log(templates, wallet)
  // const filledTemplated = templates.pages.map(page => {
  //   const filledPage = page.elements.map(element => {
  //     const elementClone = { ...element }
  //     const path = elementClone.path
  //     if (path !== null) {
  //       const walletData = get(extendedWallet, path)
  //
  //       if (walletData === undefined)
  //         throw `Wallet data not found at path ${path}`
  //
  //       // console.log(extendedWallet, path, get(extendedWallet, path))
  //       elementClone.data = walletData
  //       return elementClone
  //     }
  //     return elementClone
  //   })
  //   return filledPage
  // })
}

class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.latch = false
    this.canvasRef = React.createRef()
    this.canvas = null
    this.state = {
      // results: [],
      // pages: null,
      // totalPages: null,
    }
  }

  async componentDidMount() {
    this.canvas = initCanvas(this.canvasRef.current, { x: 612, y: 792 }, 4)

    // const extendTemplates = templates.pages
    //   .reduce((acc, page) => {
    //     if (page.)
    //   }, [])

    const extWalPromises = this.props.wallets.map((wallet) =>
      extendWallet(clone(wallet))
    )

    const extendedWallets = await Promise.all(extWalPromises)

    const extendedTemplates = extendedWallets.map((wallet) =>
      extendTemplates(wallet, templates)
    )

    console.log(extendedTemplates)

    // const withShards = pairs
    //   .reduce((acc, pair) => {
    //     if (pair.wallet.meta.tier === 'galaxy') {
    //       const shardCount = pair.wallet.shards.length
    //       const shardPageCopies = sequence(shardCount)
    //         .map((_, i) => {
    //           const clone = clone(shardPage)
    //           // deconstruct shard page, get element from elements and replace
    //         const clone.
    //       })
    //     }
    //   }, [])

    console.log(extendedWallets)

    // templates.map(template => preprocess(templates, wallet))
    //
    //   console.log(filledTemplates)

    // Promise.all(extWalPromises)
    //   .then((wallets) => {
    //     return wallets
    //       .map(wallet => preprocess(templates, wallet))
    //   })
    //   .catch(err => console.error(err))
    //
    // this.props.wallets
    //   .map(wallet => extendWallet(clone(wallet)))
  }

  // drawLayout = (page) => {
  //
  //   const ctx = this.canvas.getContext('2d');
  //
  //   ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //
  //   ctx.fillStyle="#FFF";
  //   ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  //
  //   ctx.fillStyle="#000";
  //
  //   page.renderables.forEach(r => {
  //     if (r.type === 'qr') return drawQR({ ctx, ...r });
  //     if (r.type === 'patq') return drawPatQ({ ctx, ...r });
  //     if (r.type === 'img') return drawImg({ ctx, ...r });
  //     if (r.type === 'addr_split_four') return drawEthereumAddressLong({ ctx, ...r });
  //     if (r.type === 'wrap_addr_split_four') return drawEthereumAddressCompact({ ctx, ...r });
  //     if (r.type === 'sigil') return drawSigil({ ctx, ...r });
  //     if (r.type === 'rect') return drawRect({ ctx, ...r });
  //     if (r.type === 'hr') return drawLine({ ctx, ...r });
  //     if (r.type === 'template_text') return drawWrappedText({ ctx, ...r });
  //     if (r.type === 'text') return drawWrappedText({ ctx, ...r });
  //   });
  //
  //   const pageWithImageData = {
  //     ship: page.ship,
  //     collateralType: page.collateralType,
  //     bin: page.bin,
  //     page: get(page, 'page', '1'),
  //     pageTitle: page.pageTitle,
  //     png: dataURItoBlob(this.canvas.toDataURL("image/png")),
  //     durl: this.canvas.toDataURL("image/png"),
  //   };
  //   return pageWithImageData;
  // };

  render() {
    return <canvas className={this.props.className} ref={this.canvasRef} />
  }
}

export default PaperCollateralRenderer
