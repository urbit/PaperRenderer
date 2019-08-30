import React, { Component } from 'react'
import get from 'lodash.get'

import { initCanvas, dataURItoBlob, clone, sequence } from './lib/utils'
import { draw } from './lib/draw'
import { loadImg, loadSigil } from './lib/load'
import templates from './templates.json'
import { version } from '../../package.json'

const QR_LOADING_SIZE = 100
const SIGIL_LOADING_SIZE = 100
const CANVAS_SIZE = { x: 612, y: 792 }

// We use the Urbit HD wallet for the 'source of truth' for data printed onto the wallet. Here, we generate assets needed for downstream drawing. Most of these involve loading images, which are always loaded asynchronously in a browser environment. We extend the wallet, meaning adding new key/value pairs that contain this new data.
const extendWallet = async (wallet) => {
  if (wallet.meta !== undefined) {
    // load sigil
    const patp = wallet.meta.patp

    const sigilDark = await loadSigil(SIGIL_LOADING_SIZE, patp, [
      'black',
      'white',
    ])

    wallet.meta.sigilDark = sigilDark

    const sigilLight = await loadSigil(SIGIL_LOADING_SIZE, patp, [
      'white',
      'black',
    ])

    wallet.meta.sigilLight = sigilLight
  }

  // add the ship's azimuth url
  wallet.meta.azimuthUrl = `${wallet.meta.patp}.azimuth.network`
  wallet.meta.keyGeneratorVersion = `v${wallet.meta.generatorVersion}`
  wallet.meta.paperRendererVersion = `v${version}`
  wallet.meta.walletVersion = `${wallet.meta.proposalVersion}`

  // Add the date created with formatting
  const date = new Date()
  const formattedDate = `${date.getUTCFullYear()}/${date.getUTCDate()}/${date.getUTCDate()}`
  wallet.meta.dateCreated = formattedDate

  // handle shards: This could be graduated into urbit-key-generation
  const shards = [...wallet.shards]
  const newShards = shards.map((shard, idx) => {
    return {
      number: idx + 1,
      total: shards.length,
      shard: shard,
    }
  })

  wallet.shards = newShards

  return wallet
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

// For each te
const generatePng = (canvas, pair, debug) => {
  const imagePages = pair.templates.map((page) => {
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    page.elements.forEach((elem) => {
      try {
        draw[elem.draw](ctx, elem)
      } catch (e) {
        console.log(page, elem, draw[elem.draw])
        console.error(e)
      }
    })

    // draw layout grid if debug mode is on
    if (debug === true) {
      const cols = [96, 186, 206, 296, 316, 406, 426, 516]

      const cardEdges = [80, 532]

      const bl4 = 4
      const bl8 = 8
      const bl16 = 16

      sequence(Math.floor(CANVAS_SIZE.y / bl8)).forEach((y) => {
        ctx.strokeWidth = 1
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.33)'
        ctx.beginPath()
        ctx.moveTo(0, y * bl8)
        ctx.lineTo(CANVAS_SIZE.x, y * bl8)
        ctx.stroke()
      })

      sequence(Math.floor(CANVAS_SIZE.y / 16)).forEach((y) => {
        ctx.strokeWidth = 1
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)'
        ctx.beginPath()
        ctx.moveTo(0, y * bl16)
        ctx.lineTo(CANVAS_SIZE.x, y * bl16)
        ctx.stroke()
      })

      // draw the layout columns
      cols.forEach((x) => {
        ctx.strokeWidth = 1
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_SIZE.y)
        ctx.stroke()
      })

      // Draw the edges of the card-shaped outline
      cardEdges.forEach((x) => {
        ctx.strokeWidth = 1
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)'
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_SIZE.y)
        ctx.stroke()
      })
    }

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
    // this.latch = false
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

    // For each pages/wallet pair, insert data from wallet into template elements
    const filledPairs = pairs.map((pair) => {
      return merge(pair)
    })

    // For each pair of wallet + templates, descend into the pages of each template, and again to each element of each template. Using the 'draw' property, call the function with a matching name to draw the data to the canvas. Do this for each element of each page, retrieve the image data from the canvas context and then clear the canvas before starting a new page.
    const trios = filledPairs.map((pair) => {
      return generatePng(this.canvas, pair, this.props.debug)
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
