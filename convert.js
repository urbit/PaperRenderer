require('dotenv').config()
const Figma = require('figma-js');
const fs = require('fs')

const OUTPUT_PATH = __dirname + 'lib/src/templates.json'

import { getComponent } from './elementSchema'

// Figma Naming Convention: >componentName:@data
// to parse and import new Figma components, add a new value to figmaTypes
const figmaTypes = [
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
];

// types whose data is retrieved asynchronously (we do not import the figma data)
const asyncTypes = [
  "sigil",
  "qr"
];

// these Figma types house children elements, so we need to transverse all children nodes when we find a parentType
const parentTypes = [
  "group",
  "instance"
];

// removes data portion of Figma name and retrieves component name
const formatName = (type) => {
  return type
    .split(':')[0]
    .replace('>','')
    .toLowerCase();
}

// we use the name as the component ID. for plain text components, we use Figma's type attribute
const getComponentId = (child, name) => {
  if (child.type === 'TEXT') return 'text'
  if (figmaTypes.includes(name)) return name
  if (child === null) return null

  throw new Error(`Child: ${child.type} \n\t with Name: ${name}\n\tnot supported`);
}

var currTemplate = "";

const @templateSchema = [];

// const @pageSchema = {
//   // elements on the page in figma, ungrouped
//   elements: [
//     @elementSchema,
//     @elementSchema,
//     @elementSchema,
//     @elementSchema,
//     @elementSchema,
//     ...etc,
//   ],
//   // which security group this page belongs to. Important for organizing the final ZIP folder that the user downloads.
//   bin: 3,
//   // output png per page, null until PNG is drawn
//   output: null,
//   type: 'management',
//   class: 'star'
// }
//
// const @pageSchema = {
//   elements: [],
//   bin: -1,
//   output: null,
//   type: '',
//   classOf: '',
// }

const frame = {
  classOf:"",
  usage:"",
  bin:'',
}

const splitFrameTitle(title){
  return title.split(",")
              .replace(" ". "")
}


const getFrameData(title) {
  var data = splitFrameTitle(title)
  frame.classOf = data[0]
  frame.usage = data[1]
  frame.bin = data[3]
  return frame
}

// parses the template title in figma to get basic page template data
// example templateTitle = "star, master-ticket, 4"
const getPageData(templateTitle){
  // data[0] = star, data[1] = master-ticket, data[2] = 4
  var data = getFrameData(templateTitle);




  return data
}

// checks if the child is a wanted component, ie "qr"
const isComponent(name){
  if(asyncTypes.includes(name) || figmaTypes.includes(name))
    return true
  return false
}

const getEltData(child, name){
  // 
}

// creates an element for pageschema
const createElt(child){
  var name = getComponentId(child)
  var component = getComponent(child,name)
  if(component != null){
    var data = getEltData(child, name)
    if(data != null) component.data = data
    // throw error that could not find any data
  // throw error that the type found was not supported
  return null
}

// iteration number
const flatPack = (lo) => {
  @pageSchema = null
  const extracted = lo.children.reduce((acc, child) => {

    // frame signals a new template page
    if(child.type === "FRAME"){

      @pageSchema = null                  // reset pageSchema
      elements = null                     // reset page elements

      var data = getPageSchemaData(child)

      if(data.length > 0){ @pageSchema.classOf = data.classOf }
      else{ console.log(`Unable to get class type for ${templateTitle} frame`); }

      if(data.length > 1){ @pageSchema.usage = data.usage; }
      else{ console.log(`Unable to get template title for ${templateTitle} frame`); }

      if(data.length > 2){ @pageSchema.bin = data.bin; }
      else{ console.log(`Unable to get bin data for ${templateTitle} frame`); }
      // pageSchema data now set

      @templateSchema.push(@pageSchema);  // push the previous frame's data

      // traverse down child element
      return acc
    }

    // console.log(child.name)
    const name = formatName(child.name)

    // do not traverse into children of sigil and qr
    if (parentTypes.includes(child.type.toLowerCase())) {

      if (asyncTypes.includes(name)) {

        var elt = createElt(child); // here we'll check to see what its type is and that whole kit and kaboodle
        if(elt != null)
          @templateSchema.@pageSchema.elements.push(elt)

        return [...acc, {...child, type: name}];
        // var elt =
        // @pageSchema.elements.push(elt)
      }

      // if no special items are found, traverse down into group
      // dont save any of the non-special items
      return [...acc, ...flatPack(child)]
    }


    const component = getComponentId(child, name);

    if (component != null) {

      // return [...acc, {...child, type: component}];
    }
    return acc

  }, []);
  return extracted
};

const TOKEN = process.env.FIGMA_API_TOKEN

const client = Figma.Client({ personalAccessToken: TOKEN })

client.file('a4u6jBsdTgiXcrDGW61q5ngY').then(res => {

  const KEY = 'Registration 1.2'
  const arr = res.data.document.children
  const page = arr.filter(page => page.name === KEY)[0]

  //
  // const layouts = page.children.reduce((acc, lo) => {
  //
  //   return {
  //     ...acc,
  //     [lo.name]: {
  //       key: lo.name,
  //       renderables: flatPack(lo).map(child => {
  //               if (child.type === 'qr') {
  //                 return {
  //                   type: 'qr',
  //                   size: child.absoluteBoundingBox.height,
  //                   name: child.name,
  //                   data: child.name.split(':')[1],
  //                   x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
  //                   y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
  //                 };
  //               };
  //       }
  //
  //         console.warn(`Untyped child ${child.name} in flat layouts`)
  //       }),
  //     }
  //   }
  // }, {});
  const layouts = page.children.reduce((acc, lo) => {
    return {
      ...acc,
      [lo.name]: {
        key: lo.name,
        absoluteBoundingBox: lo.absoluteBoundingBox,
        renderables: flatPack(lo).map(child => {
          if (child.type === 'qr') {
            return {
              type: 'qr',
              size: child.absoluteBoundingBox.height,
              name: child.name,
              data: child.name.split(':')[1],
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
            };
          };

          if (child.type === 'sigil') {
            return {
              type: 'sigil',
              size: child.absoluteBoundingBox.height,
              name: child.name,
              data: child.name.split(':')[1],
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
            };
          };

          if (child.type === 'img') {
            return {
              type: 'img',
              width: child.absoluteBoundingBox.height,
              height: child.absoluteBoundingBox.width,
              name: child.name,
              data: child.name.split(':')[1],
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
            };
          };

          if (child.type === 'text') {
            return {
              type: 'text',
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

          if (child.type === 'template_text') {
            return {
              type: 'template_text',
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

          if (child.type === 'patq') {
            return {
              type: 'patq',
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

          if (child.type === 'addr_split_four') {
            return {
              type: 'addr_split_four',
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

          if (child.type === 'wrap_addr_split_four') {
            return {
              type: 'wrap_addr_split_four',
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

          if (child.type === 'rect') {
            return {
              type: 'rect',
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

          if (child.type === 'hr') {
            return {
              type: 'hr',
              dashes: child.strokeDashes,
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
              width: child.absoluteBoundingBox.width,
              height: child.absoluteBoundingBox.height,
              strokeColor: child.strokes,
              strokeWeight: child.strokeWeight,
            };
          };

          console.warn(`Untyped child ${child.name} in flat layouts`)
        }),
      }
    }
  }, {});

  // console.log(JSON.stringify(layouts, null, 2));
  // fs.writeFile(OUTPUT_PATH, JSON.stringify(layouts, null, 2), (err) => {
  //   console.log('layouts saved')
  //   process.exit()
  // })

})
