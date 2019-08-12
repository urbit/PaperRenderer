const Figma = require('figma-js')

// Figma Naming Convention: >componentName:@data
// to parse and import new Figma components, add a new value
const types = {
    figma: [
        'qr',
        'template_text',
        'rect',
        'patq',
        'text',
        'sigil',
        'img',
        'wrap_addr_split_four',
        'addr_split_four',
        'template_text',
        'hr',
    ],
    // types whose data is retrieved asynchronously (we do not import the figma data)
    async: ['sigil', 'qr'],
    // these Figma types house children elements, so we need to transverse all children nodes when we find a parentType
    singleParent: ['group', 'instance', 'frame'],
}

const isType = type => {
    if (
        types.figma.includes(type) ||
        types.async.includes(type) ||
        types.singleParent.includes(type)
    )
        return true
    return false
}

const getDataPath = name => {
    return name
        .split(':')[1]
        .replace('>', '')
        .toLowerCase()
}

const qr = (child, originX, originY) => {
    return {
        type: 'qr',
        draw: 'drawQR',
        data: null,
        path: getDataPath(child.name),
        size: child.absoluteBoundingBox.height,
        name: child.name,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
    }
}

const sigil = (child, originX, originY) => {
    return {
        type: 'sigil',
        draw: 'drawSigil',
        data: null,
        path: getDataPath(child.name),
        size: child.absoluteBoundingBox.height,
        name: child.name,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
    }
}

const img = (child, originX, originY) => {
    return {
        type: 'img',
        draw: 'drawImg',
        data: null,
        path: getDataPath(child.name),
        width: child.absoluteBoundingBox.height,
        height: child.absoluteBoundingBox.width,
        name: child.name,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
    }
}

const text = (child, originX, originY) => {
    return {
        type: 'text',
        draw: 'drawWrappedText',
        path: getDataPath(child.name),
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.characters,
        fontWeight: child.style.fontWeight,
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
        fontColor: child.fills,
    }
}

const template_text = (child, originX, originY) => {
    return {
        type: 'template_text',
        draw: 'drawWrappedText',
        path: getDataPath(child.name),
        data: null,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.name.split(':')[1],
        fontWeight: child.style.fontWeight,
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
        fontColor: child.fills,
    }
}

const patq = (child, originX, originY) => {
    return {
        type: 'patq',
        draw: 'drawPatQ',
        path: getDataPath(child.name),
        data: null,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        fontWeight: child.style.fontWeight,
        text: child.name.split(':')[1],
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
    }
}
const addr_split_four = (child, originX, originY) => {
    return {
        type: 'addr_split_four',
        draw: 'drawEthereumAddressLong',
        path: getDataPath(child.name),
        data: null,
        fontWeight: child.style.fontWeight,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.name.split(':')[1],
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
        fontColor: child.fills,
    }
}

const wrap_addr_split_four = (child, originX, originY) => {
    return {
        type: 'wrap_addr_split_four',
        draw: 'drawEthereumAddressCompact',
        path: getDataPath(child.name),
        data: null,
        fontWeight: child.style.fontWeight,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.name.split(':')[1],
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
        fontColor: child.fills,
    }
}

const rect = (child, originX, originY) => {
    return {
        type: 'rect',
        draw: 'drawRect',
        path: getDataPath(child.name),
        data: null,
        cornerRadius: child.cornerRadius,
        dashes: child.strokeDashes,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
        width: child.absoluteBoundingBox.width,
        height: child.absoluteBoundingBox.height,
        fillColor: child.fills,
        strokeColor: child.strokes,
        strokeWeight: child.strokeWeight,
    }
}

const hr = (child, originX, originY) => {
    return {
        type: 'hr',
        draw: 'drawLine',
        path: getDataPath(child.name),
        data: null,
        dashes: child.strokeDashes,
        x: child.absoluteBoundingBox.x - originX,
        y: child.absoluteBoundingBox.y - originY,
        width: child.absoluteBoundingBox.width,
        height: child.absoluteBoundingBox.height,
        strokeColor: child.strokes,
        strokeWeight: child.strokeWeight,
    }
}

const getComponent = (child, name, originX, originY) => {
    if (name === 'qr') return qr(child, originX, originY)
    if (name === 'template_text') return template_text(child, originX, originY)
    if (name === 'rect') return rect(child, originX, originY)
    if (name === 'patq') return patq(child, originX, originY)
    if (name === 'text') return text(child, originX, originY)
    if (name === 'sigil') return sigil(child, originX, originY)
    if (name === 'img') return img(child, originX, originY)
    if (name === 'wrap_addr_split_four')
        return wrap_addr_split_four(child, originX, originY)
    if (name === 'addr_split_four')
        return addr_split_four(child, originX, originY)
    if (name === 'template_text') return template_text(child, originX, originY)
    if (name === 'hr') return hr(child, originX, originY)

    return null
}

module.exports = {
    getComponent,
    types,
    isType,
}
