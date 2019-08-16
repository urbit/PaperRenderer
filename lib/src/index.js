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

const extendShards = (wallet, templates) => {
  const shardTemplatePage = templates.pages.filter(
    (page) => page.usage === 'shard'
  )

  const data = {
    total: wallet.shards.length,
  }

  const paths = {
    total: [],
    number: [],
  }

  paths.number = shardTemplatePage.elements.reduce((acc, elem, idx) => {
    if (elem.path === 'shard.number') {
      return acc.concat(idx)
    } else {
      return acc
    }
  }, [])

  paths.total = shardTemplatePage.elements.reduce((acc, elem, idx) => {
    if (elem.path === 'shard.total') {
      return acc.concat(idx)
    } else {
      return acc
    }
  }, [])

  const extendedShardPages = sequence(shardCount).map(_, (idx) => {
    const shardPageClone = clone(shardTemplatePage)

    paths.total.forEach((path) => (shardPageClone[path] = data.total))

    paths.number.forEach((path) => (shardPageClone[path] = idx))

    return shardPageClone
  })

  const noShardTemplatePage = templates.pages.filter(
    (page) => page.usage !== 'shard'
  )

  const newPages = [...noShardTemplatePage, ...extendedShardPages]
  return newPages

  // get paths of
  // shard.shardNumber
  // shard.total
  // shard.index

  // then directly update cloned object
}

// Right now, the only extension we do is modifying shards.
const extendTemplates = (wallet, templates) => {
  console.log(wallet.meta)
  // right now, we only offer the shard option for galaxies.
  if (wallet.meta.tier === 'galaxy' && wallet.shards.length > 1) {
    return extendShards(wallet, templates)
  }

  return templates
}

const preprocess = (templates, wallet) => {
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

    const sdf = extendedWallets.map((wallet) =>
      extendTemplates(wallet, templates)
    )

    console.log(sdf)

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
