import React, { Component } from 'react'
import { get } from 'lodash'
import flat from 'flat'
import templates from './templates.json'

import {
  initCanvas,
  dataURItoBlob,
  clone,
  sequence,
  shortDateToDa,
} from './lib/utils'
import { draw } from './lib/draw'

import { loadImg, loadQR, loadSigil } from './lib/load'

const QR_LOADING_SIZE = 100
const SIGIL_LOADING_SIZE = 100
const CANVAS_SIZE = { x: 612, y: 792 }

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
  wallet.meta.createdOn = `${shortDateToDa(new Date())}`

  return wallet
}

// In order to only use one shard template, we have to programmatically create new templates for each shard given the number of shards, and index of each one. Doing this is fairly difficult.
const extendShards = (pair) => {
  const { wallet, templates } = pair
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
  return {
    ...pair,
    templates: [...noShardTemplatePage, ...extendedShardPages],
  }
}

// Right now, the only extension we do is modifying shards – only do so if the ship is a galaxy and has shards.
const extendTemplates = (pair) => {
  const { wallet, templates } = pair
  // right now, we only offer the shard option for galaxies.
  if (wallet.meta.tier === 'galaxy' && wallet.shards.length > 1) {
    return {
      templates: extendShards(templates, wallet),
      ...pair,
    }
  }

  // if there is nothing to extend, just return the pair object
  return pair
}

// apply the data in wallet to templates
const merge = (pair) => {
  const { templates, wallet } = pair

  const docket = templates.filter((template) => {
    return template.classOf === 'all' || template.classOf === wallet.meta.tier
  })

  const filledTemplates = docket.map((template) => {
    const filledElems = template.elements.map((elem) => {
      if (elem.path === null) return elem
      if (elem.data !== null) return elem
      if (elem.path !== null) {
        return {
          ...elem,
          data: get(wallet, elem.path),
        }
      }
    })
    return {
      ...template,
      elements: filledElems,
    }
  })

  return {
    templates: filledTemplates,
    wallet: wallet,
  }
}

const generatePng = (canvas, pair) => {
  const imagePages = pair.templates.map((page) => {
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    page.elements.forEach((elem) => {
      try {
        if (elem.type === 'img') {
          loadImg(elem)
        }
        draw[elem.draw](ctx, elem)
      } catch (e) {
        console.log(elem, draw[elem.draw])
        console.error(e)
      }
    })

    return {
      ...page,
      png: dataURItoBlob(canvas.toDataURL('image/png')),
      uri: canvas.toDataURL('image/png'),
    }
  })

  return {
    ...pair,
    pages: imagePages,
  }
}

class PaperCollateralRenderer extends Component {
  constructor(props) {
    super(props)
    this.latch = false
    this.canvasRef = React.createRef()
    this.canvas = null
  }

  async componentDidMount() {
    this.canvas = initCanvas(this.canvasRef.current, CANVAS_SIZE, 4)

    // An array of extendWallet promises
    const _extendedWallets = this.props.wallets.map((wallet) => {
      return extendWallet(clone(wallet))
    })

    // Resolve the promises, which results in the same wallet structure but a few new keys like sigil and qr img data, as well as meta.azimuthUrl and meta.createdOn.
    const extendedWallets = await Promise.all(_extendedWallets)

    // Pair wallets and templates. Even though no templates have been altered yet, we will programmatically alter the shard templates in the next step. Since shards are wallet-specific, we don't want to separate wallets from their templates from now on.
    const pairs = extendedWallets.map((wallet) => {
      return {
        templates: templates.pages,
        wallet: wallet,
      }
    })

    // Now we have something like this:
    // [
    //  { templates: Array(13), wallet: {…}}
    //  { templates: Array(13), wallet: {…}}
    // ]

    // Apply any transformations to the template pages. In this case, all we do is replace the shard page template with however many shard pages are necessary given the wallet prop, while adding shard index information.
    const extendedPairs = pairs.map((pair) => {
      return extendTemplates(pair)
    })
    // Now, we have something that looks like this. Note the extra templates.
    // [
    //  { extendedTemplates: Array(15), templates: Array(13), wallet: {…}}
    //  { extendedTemplates: Array(13), templates: Array(13), wallet: {…}}
    // ]

    // For each pages/wallet pair, insert data from wallet into template elements
    const filledPairs = extendedPairs.map((pair) => {
      return merge(pair)
    })

    // For each pair of wallet + templates, descend into the pages of each template, and again to each element of each template. Using the 'draw' property, call the function with a matching name to draw the data to the canvas. Do this for each element of each page, retrieve the image data from the canvas context and then clear the canvas before starting a new page.
    const trios = filledPairs.map((pair) => {
      return generatePng(this.canvas, pair)
    })

    // Now, we have something that looks like this. Note the new key.
    // [
    //  { pages: Array(15), templates: Array(15), wallet: {…}}
    //  { pages: Array(13), templates: Array(13), wallet: {…}}
    // ]

    // clear the context after all images have rendered.
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // return the resolved array of wallet/template pairs to the caller
    this.props.callback(trios)
  }

  render() {
    return <canvas className={this.props.className} ref={this.canvasRef} />
  }
}

export default PaperCollateralRenderer
