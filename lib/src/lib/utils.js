import get from 'lodash.get'
import flatten from 'flat'
// import { values, match, replace } from './reset';

const PAT = /(\@)/g

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const sequence = (num) => Array.from(Array(num), (_, i) => i)

const initCanvas = (canvas, size, ratio) => {
  const { x, y } = size
  let ctx = canvas.getContext('2d')

  // offset since canvas renders half a pixel larger
  ctx.translate(0.5, 0.5)
  // let ratio = ctx.webkitBackingStorePixelRatio < 2
  //   ? window.devicePixelRatio
  //   : 1;

  // default for high print resolution.
  // ratio = ratio * resMult;

  canvas.width = x * ratio
  canvas.height = y * ratio
  canvas.style.width = x + 'px'
  canvas.style.height = y + 'px'

  canvas.getContext('2d').scale(ratio, ratio)

  return canvas
}

var getByPath = function(obj, path, def) {
  path = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
  path.forEach(function(level) {
    obj = obj[level]
  })
  if (obj === undefined) {
    return def
  }
  return obj
}

const dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs
  const byteString = atob(dataURI.split(',')[1])
  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  // create a view into the buffer
  let ia = new Uint8Array(ab)
  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString })
  return blob
}

const wordWrap = (context, text, x, y, lineHeight, fitWidth) => {
  text = text.toString()
  fitWidth = fitWidth || 0

  if (fitWidth <= 0) {
    context.fillText(text, x, y)
    return
  }
  var words = text.split(' ')
  var currentLine = 0
  var idx = 1
  while (words.length > 0 && idx <= words.length) {
    var str = words.slice(0, idx).join(' ')
    var w = context.measureText(str).width
    if (w > fitWidth) {
      if (idx == 1) {
        idx = 2
      }
      context.fillText(
        words.slice(0, idx - 1).join(' '),
        x,
        y + lineHeight * currentLine
      )
      currentLine++
      words = words.splice(idx - 1)
      idx = 1
    } else {
      idx++
    }
  }
  if (idx > 0)
    context.fillText(words.join(' '), x, y + lineHeight * currentLine)
}

// const dateToDa = (d, mil) => {
//   var fil = function(n) {
//     return n >= 10 ? n : '0' + n
//   }
//   return (
//     `~${d.getUTCFullYear()}.` +
//     `${d.getUTCMonth() + 1}.` +
//     `${fil(d.getUTCDate())}..` +
//     `${fil(d.getUTCHours())}.` +
//     `${fil(d.getUTCMinutes())}.` +
//     `${fil(d.getUTCSeconds())}` +
//     `${mil ? '..0000' : ''}`
//   )
// }

const shortDateToDa = (d, mil) => {
  var fil = function(n) {
    return n >= 10 ? n : '0' + n
  }
  // utc -7 = pdt
  var hours = d.getUTCHours() ? date.getUTCHours() - 12 : date.getHours()
  var min = fil(d.getUTCMinutes())
  var amPM = d.getUTCDate() >= 12 ? 'PM' : 'AM'

  return (
    `${d.getUTCFullYear()}/` +
    `${d.getUTCMonth() + 1}/` +
    `${fil(d.getUTCDate())}` +
    ` ` +
    `${hours}:${min} ${amPm}`
  )
}

// const isString = (str) => {
//   return typeof str === 'string' || str instanceof String
// }
//
// const isFunction = (func) => {
//   return func instanceof Function
// }
//
// const isObject = (obj) => {
//   return (typeof obj === 'object' && obj !== null) || typeof obj === 'function'
// }
//
// const isUndefined = (obj) => {
//   return obj === undefined
// }
//
// const isRegExp = (obj) => {
//   return obj instanceof RegExp
// }

export {
  clone,
  sequence,
  initCanvas,
  dataURItoBlob,
  wordWrap,
  // dateToDa,
  // shortDateToDa,
}
