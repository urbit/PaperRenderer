/*

To use this file, call getTemplateSchema at line 136 (optional figma document key param)

This function will call extractSchema, which will parse the Figma JSON.

The return will be an array of pageSchemas called templateSchema.

Each pageSchema has data such as the class, usage and bin #,
along with an array of elementSchemas (created in elementSchema.js).

templateSchema > pageSchemas > elementSchemas

*/

require('dotenv').config()
const Figma = require('figma-js');
const fs = require('fs')
const { getComponent, types, isType } = require('./elementSchema')


const OUTPUT_PATH = __dirname + '../lib/src/templates.json'


// "galaxy, management, 4" --> [galaxy, management, 4]
const splitTitle = (title) => {
  return title.toString()
              .split(",")
              .toString()
              .replace(" ", "")
}


// removes data portion of Figma name and retrieves component name
const formatName = (name) => {
  return name
    .split(':')[0]
    .replace('>','')
    .toLowerCase();
}


const getComponentId = (child) => {
  const type = child.type.toLowerCase()
  const name = formatName(child.name)

  // we use figma's type identifier for type TEXT. otherwise we use name id
  if(isType(type)) return type
  if(isType(name)) return name

  console.Error(`Component ID not supported for child of type ${type} and name ${name}`)
  return null
}


// creates an elementSchema via /elementSchema.js
const createElt = (child) => {
  const id = getComponentId(child)
  const elt = getComponent(child, id)
  if(elt === null) console.error(`Unsupported child type ${id}`)
  return elt
}


// "galaxy, management, 4" --> [galaxy, mangagement, 4] --> frame { classOf: "galaxy", usage: "management", bin: 4}
const getFrame = (title) => {
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
  else frame.usage = data[2]

  return frame
}


const extractSchema = (lo) => {
  var templateSchema = []
  var pageSchema = null
  const extracted = lo.children.reduce((acc, child) => {

    if(child.type === "FRAME"){           // frame signals a new template page
      pageSchema = { elements: null }     // reset pageSchema

      var data = getFrame(child)
      pageSchema.classOf = data.classOf
      pageSchema.usage = data.usage
      pageSchema.bin = data.bin
      templateSchema.push(pageSchema)     // push the frame's data

      return acc                          // traverse child elements
    }

    const name = getComponentId(child)
    if(name === null){
      return acc
    }

    var elt

    // do not traverse child elements of singleParent sigil/qr/group
    if (types.singleParent.includes(name)) {
      if (types.async.includes(name)) {

        elt = createElt(child)

        if(elt === null) return acc

        // add element to most recent pageSchema in templateSchema
        templateSchema[templateSchema.length-1].elements.push(elt)
        return [...acc, {...child, type: name}];
      }

      // if no special items are found, find next child
      return [...acc, ...flatPack(child)]

    }

    elt = createElt(child)
    if (elt === null) {
      return acc
    }
    templateSchema[templateSchema.length-1].elements.push(elt)
    return [...acc, {...child, type: name}];

  }, []);

  return templateSchema
};


const getTemplateSchema = (KEY) => {

  KEY = KEY || "Registration 1.2";

  const TOKEN = process.env.FIGMA_API_TOKEN
  const client = Figma.Client({ personalAccessToken: TOKEN })

  client.file('a4u6jBsdTgiXcrDGW61q5ngY').then(res => {

    const arr = res.data.document.children
    const page = arr.filter(page => page.name === KEY)[0]

    const schema = extractSchema(page)
    if (schema === null) throw new Error(`Unable to extract template schema from ${page} with key ${KEY}.`)

    return schema
  });
}

// call
getTemplateSchema("Registration 1.2")
