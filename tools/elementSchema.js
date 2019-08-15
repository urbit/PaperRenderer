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

async function getFigmaImg(id) {
    const TOKEN = process.env.FIGMA_API_TOKEN
    const fileId = 'a4u6jBsdTgiXcrDGW61q5ngY'
    const url = `https://api.figma.com/v1/images/${fileId}?ids=${id}`
    let result = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Figma-Token': TOKEN,
        },
    })

    let img = await result.json()
    console.log(img)
    return img.images.id
}

const qr = (child, page) => {
    return {
        type: 'qr',
        draw: 'drawQR',
        data: null,
        path: page.dataPath,
        size: child.absoluteBoundingBox.height,
        name: child.name,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
    }
}

const sigil = (child, page) => {
    return {
        type: 'sigil',
        draw: 'drawSigil',
        data: null,
        path: page.dataPath,
        size: child.absoluteBoundingBox.height,
        name: child.name,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
    }
}

const img = (child, page) => {
    return {
        type: 'img',
        draw: 'drawImg',
        data: null,
        path: page.dataPath,
        width: child.absoluteBoundingBox.height,
        height: child.absoluteBoundingBox.width,
        name: child.name,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
    }
}

const text = (child, page) => {
    return {
        type: 'text',
        draw: 'drawWrappedText',
        path: page.dataPath,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.characters,
        fontWeight: child.style.fontWeight,
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
        fontColor: child.fills,
    }
}

const template_text = (child, page) => {
    return {
        type: 'template_text',
        draw: 'drawWrappedText',
        path: page.dataPath,
        data: null,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.name.split(':')[1],
        fontWeight: child.style.fontWeight,
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
        fontColor: child.fills,
    }
}

const patq = (child, page) => {
    return {
        type: 'patq',
        draw: 'drawPatQ',
        path: page.dataPath,
        data: null,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        fontWeight: child.style.fontWeight,
        text: child.name.split(':')[1],
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
    }
}
const addr_split_four = (child, page) => {
    return {
        type: 'addr_split_four',
        draw: 'drawEthereumAddressLong',
        path: page.dataPath,
        data: null,
        fontWeight: child.style.fontWeight,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.name.split(':')[1],
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
        fontColor: child.fills,
    }
}

const wrap_addr_split_four = (child, page) => {
    return {
        type: 'wrap_addr_split_four',
        draw: 'drawEthereumAddressCompact',
        path: page.dataPath,
        data: null,
        fontWeight: child.style.fontWeight,
        fontFamily: child.style.fontFamily,
        fontSize: child.style.fontSize,
        text: child.name.split(':')[1],
        maxWidth: child.absoluteBoundingBox.width,
        lineHeightPx: child.style.lineHeightPx,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
        fontColor: child.fills,
    }
}

const rect = (child, page) => {
    return {
        type: 'rect',
        draw: 'drawRect',
        path: page.dataPath,
        data: null,
        cornerRadius: child.cornerRadius,
        dashes: child.strokeDashes,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
        width: child.absoluteBoundingBox.width,
        height: child.absoluteBoundingBox.height,
        fillColor: child.fills,
        strokeColor: child.strokes,
        strokeWeight: child.strokeWeight,
    }
}

const hr = (child, page) => {
    return {
        type: 'hr',
        draw: 'drawLine',
        path: page.dataPath,
        data: null,
        dashes: child.strokeDashes,
        x: child.absoluteBoundingBox.x - page.originX,
        y: child.absoluteBoundingBox.y - page.originY,
        width: child.absoluteBoundingBox.width,
        height: child.absoluteBoundingBox.height,
        strokeColor: child.strokes,
        strokeWeight: child.strokeWeight,
    }
}

const getComponent = (child, name, page) => {
    if (name === 'qr') return qr(child, page)
    if (name === 'template_text') return template_text(child, page)
    if (name === 'rect') return rect(child, page)
    if (name === 'patq') return patq(child, page)
    if (name === 'text') return text(child, page)
    if (name === 'sigil') return sigil(child, page)
    if (name === 'img') return img(child, page)
    if (name === 'wrap_addr_split_four')
        return wrap_addr_split_four(child, page)
    if (name === 'addr_split_four') return addr_split_four(child, page)
    if (name === 'template_text') return template_text(child, page)
    if (name === 'hr') return hr(child, page)

    return null
}

module.exports = {
    getComponent,
    types,
    isType,
}
