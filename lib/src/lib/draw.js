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

const baseline = (fontSize, lineHeightPx, y) => {
  return y + fontSize
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
  ctx.fillText(data, x, baseline(fontSize, lineHeightPx, y))
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
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor

  wordWrap(
    ctx,
    data,
    x,
    baseline(fontSize, lineHeightPx, y),
    lineHeightPx,
    width,
    fontColor
  )
}

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
  const offset = lineHeightPx / 4

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.fillText(`0x ${addr}`, x, baseline(fontSize, lineHeightPx, y))
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

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.fillStyle = fontColor
  ctx.fillText(ch[0], x, baseline(fontSize, lineHeightPx, y))
  ctx.fillText(ch[1], x, baseline(fontSize, lineHeightPx, y) + lineHeightPx)
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

  ctx.strokeStyle = strokeColor
  ctx.lineWidth = strokeWeight
  ctx.stroke()
  ctx.fillStyle = rgbFill
  ctx.fill()
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
  wrappedText: wrappedText,
  ethereumAddress: ethereumAddress,
  shard: shard,
  rect: rect,
  line: line,
}

export { draw }
