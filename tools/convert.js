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
const {
  getComponentTagData,
  getComponent,
  getSchema,
  types,
  isType,
} = require('./component')

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

// recursively get all children from a frame
const getChildren = (child, frame) => {
  const children = child.children.reduce((acc, child) => {
    const t = getComponentTagData(child)

    // if (t.type === null) {
    //   console.error(`unsupported type for child ${child.name}`)
    //   return acc
    // }

    if (types.async.includes(t.type)) return [...acc, getChildren(child, frame)]

    if (types.group.includes(t.type)) return [...acc, getChildren(child, frame)]

    if (types.component.includes(t.type)) return acc.concat(child)

    return acc
  }, [])
  return children
}

const flatPack = (frames) => {
  const extracted = frames.map(function(child) {
    // ignore notes that lie outside of a frame
    if (child.children !== undefined) {
      const frame = getSchema(child, 'frame', null)

      frame.elements = getChildren(child, frame)

      return frame
    }
  })
  return extracted
}

const figmaToJSON = (fileKey, pageKey) => {
  const TOKEN = process.env.FIGMA_API_TOKEN
  const client = Figma.Client({ personalAccessToken: TOKEN })

  client.file(fileKey, { geometry: 'paths' }).then((res) => {
    const arr = res.data.document.children
    const page = arr.filter((page) => page.name === pageKey)[0]

    // convert obj to array
    const frames = Object.keys(page.children).map((i) => page.children[i])
    const pages = flatPack(frames, null)
    const template = getSchema(page, page.type, pages)

    writeData(template, OUTPUT_PATH)
    console.log(`Templates saved in ${OUTPUT_PATH}`)
  })
}

figmaToJSON(FIGMA_FILE_KEY, FIGMA_PAGE_KEY)

module.exports = { getComponentTagData }
