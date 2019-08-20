import React, { Component } from 'react'
import { get } from 'lodash'
import flat from 'flat'
import templates from './templates.json'

import { initCanvas, dataURItoBlob } from './lib/utils'
import { draw } from './lib/draw'

import { loadImg, loadQR, loadSigil } from './lib/load'

const QR_LOADING_SIZE = 100
const SIGIL_LOADING_SIZE = 100

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const sequence = (num) => Array.from(Array(num), (_, i) => i)

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

  wallet.meta.azimuthUrl = `${wallet.meta.patp}.azimuth.network`
  wallet.meta.createdOn = `${Date()}`

  console.log(wallet)

  return wallet
}

// In order to only use one shard template, we have to programmatically create new templates for each shard given the number of shards, and index of each one. Doing this is fairly difficult.
const extendShards = (templates, wallet) => {
  // First, we get the shard page template object. There is only one, so we take the first returned item.
  const shardTemplatePage = templates.pages.filter((page) => {
    return page.usage === 'shard'
  })[0]

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
  const extendedShardPages = sequence(data.total).map((idx) => {
    const shardPageClone = clone(shardTemplatePage)
    paths.total.forEach((path) => {
      shardPageClone.elements[path].data = data.total
    })
    paths.number.forEach((path) => {
      shardPageClone.elements[path].data = idx
    })
    return shardPageClone
  })

  // get everything but the shard template in order to fully replace the original shard page with the new shard pages with infilled data
  const noShardTemplatePage = templates.pages.filter((page) => {
    return page.usage !== 'shard'
  })

  // concat the other pages with the new shard pages
  const newPages = { pages: [...noShardTemplatePage, ...extendedShardPages] }
  return Object.assign({}, templates, newPages)
}

// Right now, the only extension we do is modifying shards – only do so if the ship is a galaxy and has shards.
const extendTemplates = (templates, wallet) => {
  // right now, we only offer the shard option for galaxies.
  if (wallet.meta.tier === 'galaxy' && wallet.shards.length > 1) {
    return Object.assign({}, extendShards(templates, wallet), {
      wallet: wallet,
    })
  }

  // if there is nothing to extend, just return templates object
  return Object.assign({}, templates, { wallet: wallet })
}

const merge = (pagesAndWallet) => {
  const pages = pagesAndWallet.pages
  const wallet = pagesAndWallet.wallet

  const docket = pages.filter((page) => {
    return page.classOf === 'all' || page.classOf === wallet.meta.tier
  })

  const filled = docket.map((page) => {
    const filledElems = page.elements.map((elem) => {
      if (elem.path === null) return elem
      if (elem.data !== null) return elem
      if (elem.path !== null) {
        return Object.assign({}, elem, { data: get(wallet, elem.path) })
      }
    })
    return Object.assign({}, page, { elements: filledElems })
  })

  return Object.assign(
    {},
    { filledPages: filled },
    { originalPages: pages },
    { wallet: wallet }
  )
}

class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.latch = false
    this.canvasRef = React.createRef()
    this.canvas = null
  }

  async componentDidMount() {
    this.canvas = initCanvas(this.canvasRef.current, { x: 612, y: 792 }, 4)

    // an array of promises
    const extWalPromises = this.props.wallets.map((wallet) => {
      return extendWallet(clone(wallet))
    })

    // still wallet structure but a few new keys
    const extendedWallets = await Promise.all(extWalPromises)

    // [
    //  {figmaPageID: "Registration 1.2", pages: Array(15), wallet: {…}}
    //  {figmaPageID: "Registration 1.2", pages: Array(13), wallet: {…}}
    // ]
    // it might be clearer to move some logic out of extendTemplates
    const pairs = extendedWallets.map((wallet) => {
      return extendTemplates(templates, wallet)
    })

    // For each stages pages/wallet pair, insert data from wallet into template elements
    const filledPairs = pairs.map((pair) => {
      return merge(pair)
    })

    const resolvedPairs = filledPairs.map((pair) => {
      const imagePages = pair.filledPages.map((page) => {
        const ctx = this.canvas.getContext('2d')

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.fillStyle = '#FFF'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        page.elements.forEach((elem) => {
          console.log(elem, draw[elem.draw])
          try {
            draw[elem.draw](ctx, elem)
          } catch (e) {
            console.error(e)
          }
        })

        const newPage = Object.assign(
          {},
          page,
          { png: dataURItoBlob(this.canvas.toDataURL('image/png')) },
          { uri: this.canvas.toDataURL('image/png') }
        )

        return newPage
      })

      return Object.assign({}, pair, { imagePages: imagePages })
    })

    this.props.callback(resolvedPairs)
  }

  render() {
    return <canvas className={this.props.className} ref={this.canvasRef} />
  }
}

export default PaperCollateralRenderer
