const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const sequence = (num) => Array.from(Array(num), (_, i) => i)

const initCanvas = (canvas, size, ratio) => {
  const { x, y } = size
  let ctx = canvas.getContext('2d')

  // const dpi300 = window.devicePixelRatio * (300 / 72)
  const dpi200 = window.devicePixelRatio * (200 / 72)

  canvas.width = x * dpi200
  canvas.height = y * dpi200
  canvas.style.width = x + 'px'
  canvas.style.height = y + 'px'

  canvas.getContext('2d').scale(dpi200, dpi200)

  return canvas
}

const baseline = (fontSize, y) => {
  return y + fontSize
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

export {
  clone,
  sequence,
  initCanvas,
  dataURItoBlob,
  wordWrap,
  baseline,
  // dateToDa,
  // shortDateToDa,
}
