import { wordWrap } from './utils'

const qr = (ctx, { data, x, y, size, type }) => {
  ctx.drawImage(data, x, y + 3, size, size)
}

const sigil = (ctx, { data, x, y, width, height, type }) => {
  ctx.drawImage(data, x, y, width, height)
}

const img = (ctx, { type, draw, data, width, height, x, y, color }) => {
  // move img to correct xy pos
  ctx.translate(x, y + 3)

  // draw using svg path data
  const path = new Path2D(data)
  ctx.fillStyle = color
  ctx.fill(path)

  // reset translation by performing the inverse translation
  ctx.translate(-x, -(y + 3))
}

const text = (
  ctx,
  {
    fontWeight,
    fontSize,
    lineHeightPx,
    width,
    height,
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
  // ctx.textBaseline = 'bottom'

  // const offset = fontFamily === 'Source Code Pro' ? -8 : 0

  console.log('text: ', lineHeightPx, height, lineHeightPx)

  ctx.fillText(data, x, y - lineHeightPx)
}

const wrappedText = (
  ctx,
  {
    fontWeight,
    fontSize,
    lineHeightPx,
    width,
    height,
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

  console.log('wrappedText: ', lineHeightPx, height, lineHeightPx)

  const offset = lineHeightPx / 4

  wordWrap(ctx, data, x, y + offset, lineHeightPx, width, fontColor)
}

// const ethereumAddressCompact = (
//   ctx,
//   { fontWeight, fontSize, lineHeightPx, x, y, fontFamily, data, fontColor }
// ) => {
//   const _0x = data.substring(0, 2)
//   const rest = data.substring(2)
//
//   // 20 is ethereum addr length without the 0x
//   const row1 = rest.substring(0, 20)
//   const row2 = rest.substring(20)
//
//   // size is the number of chars per space gapped char group
//   const size = 4
//
//   const re = new RegExp('.{1,' + size + '}', 'g')
//   const row1c = row1.match(re)
//   const row2c = row2.match(re)
//
//   const row1r = [_0x, ...row1c].join(' ')
//   const row2r = row2c.join(' ')
//
//   ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
//   ctx.fillStyle = fontColor
//
//   ctx.fillText(row1r, x, y)
//   ctx.fillText(row2r, x + ctx.measureText('0x ').width, y + lineHeightPx * 2)
// }

const ethereumAddress = (
  ctx,
  {
    fontWeight,
    fontSize,
    lineHeightPx,
    x,
    y,
    fontFamily,
    data,
    fontColor,
    width,
    height,
  }
) => {
  const addr = data
    .substring(2)
    .match(/.{1,4}/g)
    .join(' ')

  // const offset = -4

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.fillText(`0x ${addr}`, x, y + lineHeightPx)
}

const shard = (
  ctx,
  {
    fontWeight,
    fontSize,
    lineHeightPx,
    x,
    y,
    width,
    height,
    fontFamily,
    data,
    fontColor,
  }
) => {
  const ch = data.match(/.{1,56}/g)

  // const offset = -4

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.fillText(ch[0], x, y + lineHeightPx)
  ctx.fillText(ch[1], x, y + lineHeightPx + lineHeightPx)
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
  // text: text,
  wrappedText: wrappedText,
  // ethereumAddressCompact: ethereumAddressCompact,
  ethereumAddress: ethereumAddress,
  shard: shard,
  rect: rect,
  line: line,
}

export { draw }
