// Leave this here, it may be used again.
// import qr from 'qr-image'
import { sigil, stringRenderer } from 'urbit-sigil-js'

const loadImg = (base64, size) => {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.width = size
    img.height = size
    img.addEventListener('load', (e) => resolve(img))
    img.addEventListener('error', () => {
      reject(new Error(`Failed to load image's data-url: ${base64}`))
    })
    img.src = base64
  })
}

const DATA_URI_PREFIX = 'data:image/svg+xml;base64,'

// Leave this here, it may be used again.
// const loadQR = (size, data) => {
//   const svg = qr.imageSync(data, {
//     type: 'svg',
//     size,
//     margin: 0,
//   })
//   const svg64 = btoa(svg)
//   const image64 = DATA_URI_PREFIX + svg64
//   return loadImg(image64, (img) => img)
// }

const loadSigil = (size, patp) => {
  const svg = sigil({
    size: size,
    patp,
    colors: ['black', 'white'],
    renderer: stringRenderer,
  })
  // Old way it worked
  // const svg64 = btoa(svg);
  // const image64 = DATA_URI_PREFIX + svg64;
  // The way it needs to work to support both Chrome and Firefox at the same time:
  const svgDocument = new DOMParser().parseFromString(svg, 'image/svg+xml')
  svgDocument.documentElement.width.baseVal.valueAsString = `${size}px`
  svgDocument.documentElement.height.baseVal.valueAsString = `${size}px`
  const base64EncodedSVG = btoa(
    new XMLSerializer().serializeToString(svgDocument)
  )

  return loadImg(DATA_URI_PREFIX + base64EncodedSVG, size)
}

export { loadImg, loadSigil }
