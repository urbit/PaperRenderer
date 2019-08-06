const Figma = require('figma-js');

const EXTENDED_WALLET_PATH = '/preview/src/js/sampleWallets/wallet.json'

// Figma Naming Convention: >componentName:@data
// to parse and import new Figma components, add a new value
const types = {
  figma: [
    "qr",
    "template_text",
    "rect",
    "patq",
    "text",
    "sigil",
    "img",
    "wrap_addr_split_four",
    "addr_split_four",
    "template_text",
    "hr",
  ],
  // types whose data is retrieved asynchronously (we do not import the figma data)
  async: [
    "sigil",
    "qr"
  ],
  // these Figma types house children elements, so we need to transverse all children nodes when we find a parentType
  singleParent: [
    "group",
    "instance"
  ],
}

const isType = (type) => {
  if(types.figma.includes(type) ||
     types.async.includes(type) ||
     types.singleParent.includes(type))
     return true
  return false
}

const qr(child) = {
  return {
    type: 'qr',
    draw: 'drawQR',
    data: child.name.split(':')[1],
    path: EXTENDED_WALLET_PATH,
    size: child.absoluteBoundingBox.height,
    name: child.name,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
  };
};

const sigil(child) = {
  return {
    type: 'sigil',
    draw: 'drawSigil',
    data: child.name.split(':')[1],
    path: EXTENDED_WALLET_PATH,
    size: child.absoluteBoundingBox.height,
    name: child.name,
    data: child.name.split(':')[1],
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
  };
};

const img(child) = {
  return {
    type: 'img',
    draw: 'drawImg',
    data: child.name.split(':')[1],
    path: EXTENDED_WALLET_PATH,
    width: child.absoluteBoundingBox.height,
    height: child.absoluteBoundingBox.width,
    name: child.name,
    data: child.name.split(':')[1],
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
  };
};

const text(child) = {
  return {
    type: 'text',
    draw: 'drawWrappedText',
    path: EXTENDED_WALLET_PATH,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    text: child.characters,
    fontWeight: child.style.fontWeight,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    fontColor: child.fills,
  };
};

const template_text(child) = {
  return {
    type: 'template_text',
    draw: 'drawWrappedText',
    path: EXTENDED_WALLET_PATH,
    data: child.name.split(':')[1],
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    text: child.name.split(':')[1],
    fontWeight: child.style.fontWeight,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    fontColor: child.fills,
  };
};

const patq(child) = {
  return {
    type: 'patq',
    draw: 'drawPatQ',
    path: EXTENDED_WALLET_PATH,
    data: child.name.split(':')[1],
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    fontWeight: child.style.fontWeight,
    text: child.name.split(':')[1],
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
  };
};
const addr_split_four(child) = {
  return {
    type: 'addr_split_four',
    draw: 'drawEthereumAddressLong',
    path: EXTENDED_WALLET_PATH,
    data: child.name.split(':')[1],
    fontWeight: child.style.fontWeight,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    text: child.name.split(':')[1],
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    fontColor: child.fills,
  };
};

const wrap_addr_split_four(child) = {
  return {
    type: 'wrap_addr_split_four',
    draw: 'drawEthereumAddressCompact',
    path: EXTENDED_WALLET_PATH,
    data: child.name.split(':')[1],
    fontWeight: child.style.fontWeight,
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    text: child.name.split(':')[1],
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    fontColor: child.fills,
  };
};

const rect(child) = {
  return {
    type: 'rect',
    draw: 'drawRect',
    path: EXTENDED_WALLET_PATH,
    data: child.name.split(':')[1],
    cornerRadius: child.cornerRadius,
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    fillColor: child.fills,
    strokeColor: child.strokes,
    strokeWeight: child.strokeWeight,
  };
};

const hr(child) = {
  return {
    type: 'hr',
    draw: 'drawLine',
    path: EXTENDED_WALLET_PATH,
    data: child.name.split(':')[1],
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    strokeColor: child.strokes,
    strokeWeight: child.strokeWeight,
  };
};

const getComponent(child, name){
  if(name === "qr")                    return qr(child)
  if(name === "template_text")         return template_text(child)
  if(name === "rect")                  return rect(child)
  if(name === "patq")                  return patq(child)
  if(name === "text")                  return text(child)
  if(name === "sigil")                 return sigil(child)
  if(name === "img")                   return img(child)
  if(name === "wrap_addr_split_four")  return wrap_addr_split_four(child)
  if(name === "addr_split_four")       return addr_split_four(child)
  if(name === "template_text")         return template_text(child)
  if(name === "hr")                    return hr(child)

  return null
}

export {
  getComponent,
  types,
  isType,
}
