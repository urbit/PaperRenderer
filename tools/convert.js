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
const { getComponent, types, isType } = require('./elementSchema')

// const FIGMA_FILE_KEY = 'a4u6jBsdTgiXcrDGW61q5ngY'
const FIGMA_FILE_KEY = '2Lh4E8LguPxidqNGKGxr1B'
// const FIGMA_PAGE_KEY = 'Registration 1.2'
const FIGMA_PAGE_KEY = 'Release 2.0'
const WALLET_PATH = 'preview/src/js/sampleWallets/wallet.json'
const OUTPUT_PATH = 'lib/src/templates.json'

var templateSchema = {
  figmaPageID: '',
  pages: [],
}

const writeData = (data, path) => {
  const fmtData = JSON.stringify(data, null, 2)
  fs.writeFile(path, fmtData, (err) => {
    if (err) throw err
  })
}

// #text@meta.dateCreated --> ["text", "meta.dateCreated"]
const getComponentTagData = (child) => {
  const data = child.name.split('@')
  data[0].replace('#', '')

  // if an @ in an email is falsely recognized as a component id
  // assign it the default figma type (such as "TEXT")
  if (!isType(data[0])) {
    data[0] = child.type.toLowerCase()
    data[1] = null
  }

  // unsupported type
  if (!isType(child.type.toLowerCase())) return null

  return {
    type: data[0],
    path: data[1],
  }
}

const getPageSchema = (child) => {
  // "galaxy, management, 4" --> ["galaxy", "management", "4"]
  const frameArr = title
    .toString()
    .replace(/\s/g, '')
    .split(',')
  return {
    classOf: frameArr[0],
    usage: frameArr[1],
    bin: frameArr[2],
    originX: child.absoluteBoundingBox.x,
    originY: child.absoluteBoundingBox.y,
  }
}

const depthFirst = (node, callback) => {
  callback(node)

  if (node.children !== null || node.children.length > 0) {
    for (c in node.children) {
      var child = node.children[c]

      if (child.hasBeenVisited === undefined) child.hasBeenVisited = true

      const tagData = getComponentTagData(child)

      // add new pageSchema to templateSchema
      if (tagData.type === 'frame')
        templateSchema.pages.push(getPageSchema(child))
      // add valid components to page's elements array
      else if (
        (types.component.includes(tagData.type) ||
          types.async.includes(tagData.type)) &&
        templateSchema.pages !== []
      ) {
        // addElementSchema
        const currPage = templateSchema.pages[templateSchema.pages.length - 1]
        const elt = getComponent(child, tagData.path, currPage)
        templateSchema.pages[templateSchema.pages.length - 1].elements.push(elt)
      }

      // continue traversal if type is NOT qr or sigil
      if (!types.async.includes(tagData.type)) depthFirst(child, callback)
    }
  }
}

const figmaToJSON = (fileKey, pageKey) => {
  const TOKEN = process.env.FIGMA_API_TOKEN
  const client = Figma.Client({ personalAccessToken: TOKEN })

  client.file(fileKey, { geometry: 'paths' }).then((res) => {
    const arr = res.data.document.children
    const page = arr.filter((page) => page.name === pageKey)[0]

    depthFirst(page, function(node) {})

    templateSchema.figmaPageID = pageKey
    writeData(templateSchema, OUTPUT_PATH)
    console.log(`Templates saved in ${OUTPUT_PATH}`)
  })
}

figmaToJSON(FIGMA_FILE_KEY, FIGMA_PAGE_KEY)
