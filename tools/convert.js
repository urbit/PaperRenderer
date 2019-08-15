/*

To use this file, call getTemplateSchema at line 136 (optional figma document key param)

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

const FIGMA_FILE_KEY = 'a4u6jBsdTgiXcrDGW61q5ngY'
const FIGMA_PAGE_KEY = 'Registration 1.2'
const WALLET_PATH = 'preview/src/js/sampleWallets/wallet.json'
const OUTPUT_PATH = 'lib/src/templates.json'

const templateSchema = {
  figmaPageID: '',
  pages: [],
}

const pageSchema = {
  classOf: '',
  usage: '',
  bin: 0,
  elements: [],
}

// "galaxy, management, 4" --> [galaxy, management, 4]
const splitTitle = title => {
  return title
    .toString()
    .replace(/\s/g, '')
    .split(',')
}

// removes data portion of Figma name and retrieves component name
const formatName = name => {
  return name
    .split(':')[0]
    .replace('>', '')
    .toLowerCase()
}

const getComponentId = child => {
  const type = child.type.toLowerCase()
  const name = formatName(child.name)
  // we use figma's type identifier for type TEXT. otherwise we use name id
  if (isType(name)) return name
  if (isType(type)) return type

  if (type !== 'vector')
    console.error(
      `Component ID not supported for child of type ${type} and name ${name}`
    )
  return null
}

// creates an elementSchema via /elementSchema.js
const createElement = (child, name, lo) => {
  const currPage = templateSchema.pages[templateSchema.pages.length - 1]
  if (currPage === null)
    throw new Error(
      `Could not get the current page for the template: ${templateSchema}`
    )

  const elt = getComponent(child, name, currPage)
  if (elt === null) console.error(`Unsupported child type ${name}`)

  return elt
}

// "galaxy, management, 4" --> [galaxy, mangagement, 4] --> frame { classOf: "galaxy", usage: "management", bin: 4}
const getFrame = title => {
  const data = splitTitle(title)
  var frame = {}

  if (data.length === 0 || data === null)
    throw new Error(`Unable to get class for ${title}'s frame.`)
  else frame.classOf = data[0]

  if (data.length === 1)
    throw new Error(`Unable to get usage for ${title}'s frame.`)
  else frame.usage = data[1]

  if (data.length === 2)
    throw new Error(`Unable to get custody number for ${title}'s frame.`)
  else frame.bin = data[2]

  return frame
}

const addPageSchema = child => {
  var data = getFrame(child.name)
  pageSchema.classOf = data.classOf
  pageSchema.usage = data.usage
  pageSchema.bin = data.bin
  pageSchema.originX = child.absoluteBoundingBox.x
  pageSchema.originY = child.absoluteBoundingBox.y
  pageSchema.dataPath = data.usage
  templateSchema.pages.push(pageSchema)
}

const addElementSchema = (child, name, lo) => {
  var elt = createElement(child, name, lo)
  if (templateSchema.pages != [] && templateSchema.pages.length > 0)
    templateSchema.pages[templateSchema.pages.length - 1].elements.push(elt)
  else
    console.error(
      `Could not add element schema for child of name ${name} because elementSchema is null`
    )
}

const endTraverse = name => {
  if (types.async.includes(name)) return true
  return false
}

const depthFirst = (node, callback) => {
  callback(node)

  if (node.children !== null || node.children.length > 0) {
    for (c in node.children) {
      var child = node.children[c]

      if (child.hasBeenVisited === undefined) child.hasBeenVisited = true

      const name = getComponentId(child)

      // create a new pageSchema and add it to templateSchema
      if (name === 'frame') {
        addPageSchema(child)
      }

      // when we find a base figma type add it to this page's elements
      else if (
        (types.figma.includes(name) || types.async.includes(name)) &&
        templateSchema.pages !== []
      )
        addElementSchema(child, name, node)

      // !endTraverse when name is NOT qr or sigil
      if (!endTraverse(name)) depthFirst(child, callback)
    }
  }
}

const extractSchema = lo => {
  console.error('Figma component of type vector is not supported.')
  depthFirst(lo, function(node) {})
}

const getTemplateSchema = (fileKey, pageKey) => {
  const TOKEN = process.env.FIGMA_API_TOKEN
  const client = Figma.Client({ personalAccessToken: TOKEN })

  client.file(fileKey).then(res => {
    const arr = res.data.document.children
    const page = arr.filter(page => page.name === pageKey)[0]

    extractSchema(page)

    if (templateSchema === null)
      throw new Error(
        `Unable to extract template schema from ${page} with key ${KEY}.`
      )
    templateSchema.figmaPageID = pageKey

    const data = JSON.stringify(templateSchema, null, 2)
    fs.writeFile(OUTPUT_PATH, data, err => {
      if (err) throw err
    })
    return templateSchema
  })
}

// call
getTemplateSchema(FIGMA_FILE_KEY, FIGMA_PAGE_KEY)
