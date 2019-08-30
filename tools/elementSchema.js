const types = {
  component: [
    'qr',
    'rect',
    'patq',
    'text',
    'sigil',
    'img',
    'wrapAddrSplitFour',
    'addrSplitFour',
    'line',
  ],
  text: ['text', 'patq', 'wrapAddrSplitFour', 'addrSplitFour'],
  // types whose data is retrieved asynchronously (we do not import the figma data)
  async: ['sigil', 'qr'],
  // these Figma types house children elements, so we need to transverse all children nodes when we find a parentType
  group: ['group', 'instance', 'frame'],
}

const getSvgPath = (child) => {
  const path = child.fillGeometry[0].path

  if (path === undefined || path === null || path === '')
    console.error(
      `Unable to get the path for the svg child: ${JSON.stringify(child)}`
    )

  return path
}

const rgba = (fills) => {
  if (fills.length === 0) return `rgba(0,0,0,0)`
  const color = fills[0].color
  const red = Math.floor(color.r * 255)
  const green = Math.floor(color.g * 255)
  const blue = Math.floor(color.b * 255)
  const alpha = Math.floor(color.a)
  return `rgba(${red},${green},${blue},${alpha})`
}

const isType = (type) => {
  if (
    types.component.includes(type) ||
    types.async.includes(type) ||
    types.group.includes(type)
  )
    return true
  return false
}

const qr = (child, tagData, frame) => {
  return {
    type: 'qr',
    draw: 'qr',
    data: null,
    path: tagData.path,
    size: child.absoluteBoundingBox.height,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
  }
}

const sigil = (child, tagData, frame) => {
  return {
    type: 'sigil',
    draw: 'sigil',
    data: null,
    path: tagData.path,
    size: child.absoluteBoundingBox.height,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
  }
}

const img = (child, tagData, frame) => {
  return {
    type: 'img',
    draw: 'img',
    data: getSvgPath(child),
    path: tagData.path,
    width: child.absoluteBoundingBox.height,
    height: child.absoluteBoundingBox.width,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
    color: rgba(child.fills),
  }
}

const text = (child, tagData, frame) => {
  return {
    type: 'text',
    draw: 'wrappedText',
    path: tagData.path,
    data: tagData.path === null ? child.characters : tagData.path,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    fontWeight: child.style.fontWeight,
    fontColor: rgba(child.fills),
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
  }
}

const patq = (child, tagData, frame) => {
  return {
    type: 'patq',
    draw: 'patq',
    path: tagData.path,
    data: null,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    fontWeight: child.style.fontWeight,
    fontColor: rgba(child.fills),
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
  }
}

const addrSplitFour = (child, tagData, frame) => {
  return {
    type: 'addrSplitFour',
    draw: 'ethereumAddressLong',
    path: tagData.path,
    data: null,
    fontWeight: child.style.fontWeight,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
    fontColor: rgba(child.fills),
  }
}

const wrapAddrSplitFour = (child, tagData, frame) => {
  return {
    type: 'wrapAddrSplitFour',
    draw: 'ethereumAddressCompact',
    path: tagData.path,
    data: null,
    fontWeight: child.style.fontWeight,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
    fontColor: rgba(child.fills),
  }
}

const rect = (child, tagData, frame) => {
  return {
    type: 'rect',
    draw: 'rect',
    path: tagData.path,
    data: null,
    cornerRadius: child.cornerRadius,
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    fillColor: rgba(child.fills),
    strokeColor: rgba(child.strokes),
    strokeWeight: child.strokeWeight,
  }
}

const line = (child, tagData, frame) => {
  return {
    type: 'line',
    draw: 'line',
    path: tagData.path,
    data: null,
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - frame.originX,
    y: child.absoluteBoundingBox.y - frame.originY,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    strokeColor: rgba(child.strokes),
    strokeWeight: child.strokeWeight,
  }
}

const components = {
  qr: (child, tagData, frame) => qr(child, tagData, frame),
  templateText: (child, tagData, frame) => templateText(child, tagData, frame),
  rect: (child, tagData, frame) => rect(child, tagData, frame),
  patq: (child, tagData, frame) => patq(child, tagData, frame),
  text: (child, tagData, frame) => text(child, tagData, frame),
  sigil: (child, tagData, frame) => sigil(child, tagData, frame),
  img: (child, tagData, frame) => img(child, tagData, frame),
  wrapAddrSplitFour: (child, tagData, frame) =>
    wrapAddrSplitFour(child, tagData, frame),
  addrSplitFour: (child, tagData, frame) =>
    addrSplitFour(child, tagData, frame),
  line: (child, tagData, frame) => line(child, tagData, frame),
}

const getComponent = (child, tagData, frame) => {
  const component = components[tagData.type]
  if (component === undefined) {
    return null
  }
  return component(child, tagData, frame)
}

const template = (child, frames) => {
  return {
    type: 'template',
    figmaFrameID: child.name,
    frames: frames,
  }
}

const frame = (child, elements) => {
  // "galaxy, management, 4" --> ["galaxy", "management", "4"]
  const title = child.name
    .toString()
    .replace(/\s/g, '')
    .split(',')
  return {
    type: 'frame',
    classOf: title[0],
    usage: title[1],
    bin: title[2],
    originX: child.absoluteBoundingBox.x,
    originY: child.absoluteBoundingBox.y,
    elements: elements,
  }
}

const schemas = {
  template: (child, array) => template(child, array),
  frame: (child, array) => frame(child, array),
}

const getSchema = (child, type, array) => {
  if (type === 'CANVAS') type = 'TEMPLATE'
  return schemas[type.toLowerCase()](child, array)
}

module.exports = {
  getComponent,
  getSchema,
  types,
  isType,
}
