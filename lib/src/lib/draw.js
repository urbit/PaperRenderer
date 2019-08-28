import { wordWrap } from './utils'

const qr = (ctx, { data, x, y, size, type }) => {
  ctx.drawImage(data, x, y + 3, size, size)
}

const sigil = (ctx, { data, x, y, size, type }) => {
  ctx.drawImage(data, x, y, size, size)
}

const img = (ctx, { data, x, y, width, height, type }) => {
  ctx.drawImage(data, x, y + 3, height, width)
}

const text = (
  ctx,
  {
    fontWeight,
    fontSize,
    lineHeightPx,
    maxWidth,
    x,
    y,
    fontFamily,
    data,
    type,
    fontColor,
  }
) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.textBaseline = 'alphabetic'

  // const offset = fontFamily === 'Source Code Pro' ? -8 : 0

  const offset = -4

  ctx.fillText(data, x, y + lineHeightPx + offset)
}

const wrappedText = (
  ctx,
  {
    fontWeight,
    fontSize,
    lineHeightPx,
    maxWidth,
    x,
    y,
    fontFamily,
    data,
    type,
    fontColor,
  }
) => {
  // const offset = fontFamily === 'Source Code Pro' ? 1 : 0

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.textBaseline = 'alphabetic'

  const offset = -4

  wordWrap(
    ctx,
    data,
    x,
    y + lineHeightPx + offset,
    lineHeightPx,
    maxWidth,
    fontColor
  )
}

const ethereumAddressCompact = (
  ctx,
  { fontWeight, fontSize, lineHeightPx, x, y, fontFamily, data, fontColor }
) => {
  const _0x = data.substring(0, 2)
  const rest = data.substring(2)

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
  ctx.fillStyle = fontColor

  ctx.fillText(row1r, x, y + lineHeightPx)
  ctx.fillText(row2r, x + ctx.measureText('0x ').width, y + lineHeightPx * 2)
}

const ethereumAddressLong = (
  ctx,
  { fontWeight, fontSize, lineHeightPx, x, y, fontFamily, data, fontColor }
) => {
  const _0x = data.substring(0, 2)
  const rest = data.substring(2)

  const size = 4

  const re = new RegExp('.{1,' + size + '}', 'g')
  const chunks = rest.match(re)

  const newText = [_0x, ...chunks].join(' ')

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor

  ctx.fillText(newText, x, y + lineHeightPx)
}

const patq = (
  ctx,
  { fontWeight, fontSize, lineHeightPx, x, y, fontFamily, data, fontColor }
) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor

  ctx.fillText(data, x, y + lineHeightPx)
  // const OFFSET = 1.2
  //
  // var start = 0,
  //   end = 0,
  //   offset = 1
  //
  // for (var lineNum = 1; lineNum < data.length / 28; lineNum++) {
  //   // 28 chars per line, unless string is < 28
  //   end = text.length > 28 ? 28 : data.length
  //
  //   ctx.font = `${fontSize}px ${fontFamily}`
  //   ctx.fillStyle = fontColor
  //
  //   ctx.fillText(data, x, y + lineHeightPx * lineNum) * offset
  //
  //   // no offset on first line
  //   offset = OFFSET
  //
  //   // remove drawn text for next iteration
  //   data = data.substring(end)
  // }
}

const rect = (
  ctx,
  {
    cornerRadius,
    dashes,
    x,
    y,
    width,
    height,
    fillColor,
    strokeColor,
    strokeWeight,
  }
) => {
  var rgbStroke = strokeColor
  var rgbFill = fillColor

  ctx.setLineDash([])

  if (dashes != null) {
    ctx.setLineDash(dashes)
  }

  if (cornerRadius > 0) {
    // offset corner radius
    // x = x
    // y = y
    // width = width
    // height = height

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
  // if (strokeColor != '') {
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = strokeWeight
  ctx.stroke()
  // } else if (rgbFill != '') {
  ctx.fillStyle = rgbFill
  ctx.fill()
  // }
}

const line = (
  ctx,
  { dashes, x, y, width, height, strokeColor, strokeWeight }
) => {
  ctx.strokeStyle = strokeColor

  // canvas renders strokes twice as big
  ctx.lineWidth = strokeWeight
  // strokeWeight != null && strokeWeight > 0 ? strokeWeight / 2 : 1

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

const draw = {
  qr: qr,
  sigil: sigil,
  img: img,
  text: text,
  wrappedText: wrappedText,
  ethereumAddressCompact: ethereumAddressCompact,
  ethereumAddressLong: ethereumAddressLong,
  patq: patq,
  rect: rect,
  line: line,
}

export { draw }
