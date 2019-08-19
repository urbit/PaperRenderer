import { wordWrap } from './utils'

const drawQR = ({ ctx, img, x, y, size, type }) =>
  ctx.drawImage(img, x, y + 3, size, size)

const drawSigil = ({ ctx, img, x, y, size, type }) =>
  ctx.drawImage(img, x, y, size, size)

const drawImg = ({ ctx, img, x, y, width, height, type }) =>
  ctx.drawImage(img, x, y + 3, height, width)

// figma colors are r, g, b values 0 - 1
// const toRgba = (figmaColor) => {
//
//   if(figmaColor.length != 0) {
//     return `rgba(${figmaColor[0].color.r*255}, ${figmaColor[0].color.g*255}, ${figmaColor[0].color.b*255}, ${figmaColor[0].color.a})`;
//   }
//
//   return "";
// }

const drawText = ({
  ctx,
  fontWeight,
  fontSize,
  lineHeightPx,
  maxWidth,
  x,
  y,
  fontFamily,
  text,
  type,
  fontColor,
}) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = toRgba(fontColor)

  // const offset = fontFamily === 'Source Code Pro' ? 1 : 0

  ctx.fillText(text, x, y + lineHeightPx)
}

const drawWrappedText = ({
  ctx,
  fontWeight,
  fontSize,
  lineHeightPx,
  maxWidth,
  x,
  y,
  fontFamily,
  text,
  type,
  fontColor,
}) => {
  // const offset = fontFamily === 'Source Code Pro' ? 1 : 0

  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`
  ctx.fillStyle = toRgba(fontColor)

  wordWrap(ctx, text, x, y + lineHeightPx, lineHeightPx, maxWidth, fontColor)
}

const drawEthereumAddressCompact = ({
  ctx,
  fontWeight,
  fontSize,
  lineHeightPx,
  x,
  y,
  fontFamily,
  text,
  fontColor,
}) => {
  const _0x = text.substring(0, 2)
  const rest = text.substring(2)

  // 20 is ethereum addr length without the 0x
  const row1 = rest.substring(0, 20)
  const row2 = rest.substring(20)

  // size is the number of chars per space gapped char group
  const size = 4

  const re = new RegExp('.{1,' + size + '}', 'g')
  const row1c = row1.match(re)
  const row2c = row2.match(re)

  const row1r = [_0x, ...row1c].join(' ')
  const row2r = row2c.join(' ')

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  // ctx.fillStyle = toRgba(fontColor);

  ctx.fillText(row1r, x, y + lineHeightPx)
  ctx.fillText(row2r, x + ctx.measureText('0x ').width, y + lineHeightPx * 2)
}

const drawEthereumAddressLong = ({
  ctx,
  fontWeight,
  fontSize,
  lineHeightPx,
  x,
  y,
  fontFamily,
  text,
  fontColor,
}) => {
  const _0x = text.substring(0, 2)
  const rest = text.substring(2)

  const size = 4

  const re = new RegExp('.{1,' + size + '}', 'g')
  const chunks = rest.match(re)

  const newText = [_0x, ...chunks].join(' ')

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  // ctx.fillStyle = toRgba(fontColor);

  ctx.fillText(newText, x, y + lineHeightPx)
}

const drawPatQ = ({ ctx, fontSize, lineHeightPx, x, y, fontFamily, text }) => {
  ctx.font = `${fontSize}px ${fontFamily}`

  const OFFSET = 1.2

  var start = 0,
    end = 0,
    offset = 1

  for (var lineNum = 1; lineNum < text.length / 28; lineNum++) {
    // 28 chars per line, unless string is < 28
    end = text.length > 28 ? 28 : text.length

    ctx.fillText(text, x, y + lineHeightPx * lineNum) * offset

    // no offset on first line
    offset = OFFSET

    // remove drawn text for next iteration
    text = text.substring(end)
  }
}

const drawRect = ({
  ctx,
  cornerRadius,
  dashes,
  x,
  y,
  width,
  height,
  fillColor,
  strokeColor,
  strokeWeight,
}) => {
  var rgbStroke = toRgba(strokeColor)
  var rgbFill = toRgba(fillColor)

  ctx.setLineDash([])

  if (dashes != null) {
    ctx.setLineDash(dashes)
  }

  if (cornerRadius > 0) {
    // offset corner radius
    x += cornerRadius / 2
    y += cornerRadius / 2
    width -= cornerRadius / 2
    height -= cornerRadius / 2

    ctx.beginPath()
    ctx.moveTo(x + cornerRadius, y)
    ctx.lineTo(x + width - cornerRadius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius)
    ctx.lineTo(x + width, y + height - cornerRadius)
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - cornerRadius,
      y + height
    )
    ctx.lineTo(x + cornerRadius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius)
    ctx.lineTo(x, y + cornerRadius)
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y)
    ctx.closePath()
  }
  if (rgbStroke != '') {
    ctx.strokeStyle = rgbStroke
    ctx.lineWidth = strokeWeight
    ctx.stroke()
  } else if (rgbFill != '') {
    ctx.fillStyle = rgbFill
    ctx.fill()
  }
}

const drawLine = ({
  ctx,
  dashes,
  x,
  y,
  width,
  height,
  strokeColor,
  strokeWeight,
}) => {
  ctx.strokeStyle = toRgba(strokeColor)

  // canvas renders strokes twice as big
  ctx.lineWidth =
    strokeWeight != null && strokeWeight > 0 ? strokeWeight / 2 : 1

  ctx.setLineDash([])

  if (dashes != null) {
    ctx.setLineDash(dashes)
  }

  var x2 = x + width
  var y2 = y + height

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

export {
  drawSigil,
  drawQR,
  drawImg,
  drawText,
  drawWrappedText,
  drawEthereumAddressCompact,
  drawEthereumAddressLong,
  drawPatQ,
  drawRect,
  drawLine,
}
