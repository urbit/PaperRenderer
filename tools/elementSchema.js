const types = {
  figma: [
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
  singleParent: ['group', 'instance', 'frame'],
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
    types.figma.includes(type) ||
    types.async.includes(type) ||
    types.singleParent.includes(type)
  )
    return true
  return false
}

const getPath = (child) => {
  const s = child.name.split('@')
  const t = s[0].replace('#', '')
  if (isType(t) && s.length > 1) return s[1]
  return null
}

const qr = (child, page) => {
  return {
    type: 'qr',
    draw: 'qr',
    data: null,
    path: getPath(child),
    size: child.absoluteBoundingBox.height,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
  }
}

const sigil = (child, page) => {
  return {
    type: 'sigil',
    draw: 'sigil',
    data: null,
    path: getPath(child),
    size: child.absoluteBoundingBox.height,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
  }
}

const img = (child, page) => {
  return {
    type: 'img',
    draw: 'img',
    data: getSvgPath(child),
    path: getPath(child),
    width: child.absoluteBoundingBox.height,
    height: child.absoluteBoundingBox.width,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
    color: rgba(child.fills),
  }
}

const text = (child, page) => {
  return {
    type: 'text',
    draw: 'wrappedText',
    path: getPath(child),
    data: child.characters === undefined ? null : child.characters,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    fontWeight: child.style.fontWeight,
    fontColor: rgba(child.fills),
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
  }
}

const patq = (child, page) => {
  return {
    type: 'patq',
    draw: 'patq',
    path: getPath(child),
    data: null,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    fontWeight: child.style.fontWeight,
    fontColor: rgba(child.fills),
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
  }
}

const addrSplitFour = (child, page) => {
  return {
    type: 'addrSplitFour',
    draw: 'ethereumAddressLong',
    path: getPath(child),
    data: null,
    fontWeight: child.style.fontWeight,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
    fontColor: rgba(child.fills),
  }
}

const wrapAddrSplitFour = (child, page) => {
  return {
    type: 'wrapAddrSplitFour',
    draw: 'ethereumAddressCompact',
    path: getPath(child),
    data: null,
    fontWeight: child.style.fontWeight,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
    fontColor: rgba(child.fills),
  }
}

const rect = (child, page) => {
  return {
    type: 'rect',
    draw: 'rect',
    path: null,
    data: null,
    cornerRadius: child.cornerRadius,
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    fillColor: rgba(child.fills),
    strokeColor: rgba(child.strokes),
    strokeWeight: child.strokeWeight,
  }
}

const line = (child, page) => {
  return {
    type: 'line',
    draw: 'line',
    path: null,
    data: null,
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - page.originX,
    y: child.absoluteBoundingBox.y - page.originY,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    strokeColor: rgba(child.strokes),
    strokeWeight: child.strokeWeight,
  }
}

const components = {
  qr: (child, page) => qr(child, page),
  templateText: (child, page) => templateText(child, page),
  rect: (child, page) => rect(child, page),
  patq: (child, page) => patq(child, page),
  text: (child, page) => text(child, page),
  sigil: (child, page) => sigil(child, page),
  img: (child, page) => img(child, page),
  wrapAddrSplitFour: (child, page) => wrapAddrSplitFour(child, page),
  addrSplitFour: (child, page) => addrSplitFour(child, page),
  line: (child, page) => line(child, page),
}

const getComponent = (child, name, page) => {
  const component = components[name]
  if (component === undefined) {
    return null
  }
  return component(child, page)
}

module.exports = {
  getComponent,
  types,
  isType,
}
