/*

To use this file, call getTemplateSchema at line 178 (optional figma document key param)

This function will call extractSchema, which will parse the Figma JSON.

The return will be an array of pages called templateSchema.

Each pageSchema has data such as the class, usage and bin #,
along with an array of elements (created in elementSchema.js).

templateSchema > pageSchemas > elementSchemas

*/

require('dotenv').config()
const Figma = require('figma-js')
const fs = require('fs')
const { getComponent, getSchema, types, isType } = require('./elementSchema')

// const FIGMA_FILE_KEY = 'a4u6jBsdTgiXcrDGW61q5ngY'
const FIGMA_FILE_KEY = '2Lh4E8LguPxidqNGKGxr1B'
// const FIGMA_PAGE_KEY = 'Registration 1.2'
const FIGMA_PAGE_KEY = 'Release 2.0'
const WALLET_PATH = 'preview/src/js/sampleWallets/wallet.json'
const OUTPUT_PATH = 'lib/src/templates.json'

const writeData = (data, path) => {
  const fmtData = JSON.stringify(data, null, 2)
  fs.writeFile(path, fmtData, (err) => {
    if (err) throw err
  })
}

// #text@meta.dateCreated --> ["text", "meta.dateCreated"]
const getComponentTagData = (child) => {
  // TEXT or FRAME type
  const figmaType = child.type.toLowerCase()

  // "#text@meta.patp" --> ["#text", "meta.patp"]
  const componentData = child.name.split('@')

  // "#text" --> "text"
  const componentType = componentData[0].replace('#', '')

  // "meta.dateCreated"
  const componentPath = componentData[1]

  // {type: "text", path: "meta.dateCreated"}
  if (isType(componentType))
    return {
      type: componentType,
      path: componentPath,
    }
  // {type: "text" path: "null"} --> text data provided in template
  else if (isType(figmaType))
    return {
      type: figmaType,
      path: null,
    }

  // when the type is not a figma/component type, it is not supported
  return {
    type: null,
    path: null,
  }
}

// if pass pages into acc buffer overload error
const flatPack = (child, frame, pages) => {
  const extracted = child.children.reduce((acc, child) => {
    const t = getComponentTagData(child)

    if (t.type === null) {
      console.error(`unsupported type for child ${child.name}`)
      return acc
    }

    if (t.type === 'frame') {
      const frame = getSchema(child, t.type, null)
      frame.elements = [...acc, ...flatPack(child, frame, pages)]
      pages.push(frame)
    }

    // ignore notes outside of any frame in figma template
    if (frame === null) return acc

    if (types.group.includes(t.type))
      return [...acc, ...flatPack(child, frame, pages)]

    if (types.async.includes(t)) return [...acc, getComponent(child, t, frame)]

    if (types.component.includes(t.type))
      return [...acc, getComponent(child, t, frame)]

    return acc
  }, [])
  return pages
}

const figmaToJSON = (fileKey, pageKey) => {
  const TOKEN = process.env.FIGMA_API_TOKEN
  const client = Figma.Client({ personalAccessToken: TOKEN })

  client.file(fileKey, { geometry: 'paths' }).then((res) => {
    const arr = res.data.document.children
    const page = arr.filter((page) => page.name === pageKey)[0]

    writeData(page, 'lib/src/out.json')
    const pages = flatPack(page, null, [])
    const template = getSchema(page, page.type, pages)

    writeData(template, OUTPUT_PATH)
    console.log(`Templates saved in ${OUTPUT_PATH}`)
  })
}

figmaToJSON(FIGMA_FILE_KEY, FIGMA_PAGE_KEY)
