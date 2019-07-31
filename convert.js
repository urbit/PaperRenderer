require('dotenv').config()
const Figma = require('figma-js');
const fs = require('fs')

const OUTPUT_PATH = __dirname + 'lib/src/templates.json'

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
  "text",
  "wrap_addr_split_four",
  "addr_split_four",
  "template_text",
  "hr"
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
]

// removes data portion of Figma name and retrieves component name
const formatName = (type) => {
  return type
    .split(':')[0]
    .replace('>','')
    .toLowerCase();
}

// we use the name as the component ID. for plain text components, we use Figma's type attribute
const getComponent = (child, name) => {
  if (child.type === 'TEXT') return 'text'
  if (figmaTypes.includes(name)) return name
  if (child === null) return null

  throw new Error(`Child: ${child.type} \n\t with Name: ${name}\n\tnot supported`);
}

const flatPack = (lo) => {
  const extracted = lo.children.reduce((acc, child) => {

    const name = formatName(child.name)

    if (parentTypes.includes(child.type.toLowerCase())) {
      // do not traverse into children of sigil and qr
      if (asyncTypes.includes(name)) return [...acc, {...child, type: name}];
      // if no special items are found, tranverse down into group
      return [...acc, ...flatPack(child)]
    }

    const component = getComponent(child, name);
    if (component != null) return [...acc, {...child, type: component}];

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
  fs.writeFile(OUTPUT_PATH, JSON.stringify(layouts, null, 2), (err) => {
    console.log('layouts saved')
    process.exit()
  })

})
