/*

To use this file, call the bottom function getTemplateSchema.

This function will call extractSchema, which will parse the Figma JSON.

The return will be an array of pageSchemas called templateSchema.

Each pageSchema has data such as the class, usage and bin #,
along with an array of elementSchemas (created in elementSchema.js).

*/

require('dotenv').config()
const Figma = require('figma-js');
const fs = require('fs')

const OUTPUT_PATH = __dirname + 'lib/src/templates.json'

import { getComponent, types } from './elementSchema'

const @templateSchema = [];

const frame = {
  classOf:'',
  usage:'',
  bin:'',
}

// "galaxy, management, 4" --> [galaxy, management, 4]
const splitTitle(title){
  return title.split(",")
              .replace(" ". "")
}

// [galaxy, mangagement, 4] --> frame { classOf: "galaxy", usage: "management", bin: 4}
const getFrame(title) {
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

// we use the name as the component ID. for plain text components, we use Figma's type attribute
const getComponentId = (child, name) => {
  if (child.type === 'TEXT') return 'text'
  if (types.figma.includes(name)) return name
  if (child === null) return null

  throw new Error(`Child: ${child.type} \n\t with Name: ${name}\n\tnot supported`);
}

// creates an elementSchema --> elementSchema.js
const createElt(child){
  var name = getComponentId(child)
  var elt = getComponent(child,name)
  if(elt != null){
    return elt
    // throw error that the type found was not supported
  return null
}

// removes data portion of Figma name and retrieves component name
const formatName = (type) => {
  return type
    .split(':')[0]
    .replace('>','')
    .toLowerCase();
}

const extractSchema = (lo) => {
  @templateSchema = null
  @pageSchema = null
  const extracted = lo.children.reduce((acc, child) => {

    if(child.type === "FRAME"){           // frame signals a new template page
      @pageSchema = null                  // reset pageSchema
      elements = null                     // reset page elements

      var data = getFrame(child)
      @pageSchema.classOf = data.classOf
      @pageSchema.usage = data.usage
      @pageSchema.bin = data.bin;
      @templateSchema.push(@pageSchema);  // push the previous frame's data

      return acc                          // traverse child elements
    }

    const name = formatName(child.name)

    // do not traverse child elements of singleParent sigil/qr/group
    if (types.singleParent.includes(child.type.toLowerCase())) {
      if (types.async.includes(name)) {
        var elt = createElt(child);
        if (elt != null) @templateSchema.@pageSchema.elements.push(elt)
        return [...acc, {...child, type: name}];
      }
      // if no special items are found, find next child
      return [...acc, ...flatPack(child)]
    }

    // const component = getComponentId(child, name);
    if ((component = getComponentId(child, name)) === null) {
      console.error(`Could not find a component to match child ${child} with name ${name}`)
      return acc
    }
    if ((elt = createElt(child)) === null) {
      console.error(`Could not find create an elementSchema for ${component} with child ${child} and name ${name}.`)
      return acc
    }
    @templateSchema.@pageSchema.elements.push(elt)
    return [...acc, {...child, type: name}];

  }, []);

  return @templateSchema
  // return extracted
};


const getTemplateSchema = () => {

  const TOKEN = process.env.FIGMA_API_TOKEN
  const client = Figma.Client({ personalAccessToken: TOKEN })

  client.file('a4u6jBsdTgiXcrDGW61q5ngY').then(res => {

    const KEY = 'Registration 1.2'
    const arr = res.data.document.children
    const page = arr.filter(page => page.name === KEY)[0]

    const extracted = extractSchema(page)
    if (extracted === null) throw new Error(`Unable to extract template schema from ${page}.`)

    return extracted
  });
}
