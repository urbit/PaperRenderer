require('dotenv').config()
const { map, reduce, filter } = require('lodash');
const Figma = require('figma-js');
const fs = require('fs')

const OUTPUT_PATH = __dirname + '/src/js/templates.json'

// Figma Naming Convention: >componentName:@data
// to parse and import new Figma components, add a new value to TYPES
const TYPES = [
  "QR",
  "TEMPLATE_TEXT",
  "RECT",
  "PATQ",
  "TEXT",
  "SIGIL",
  "IMG",
  "TEXT",
  "WRAP_ADDR_SPLIT_FOUR",
  "ADDR_SPLIT_FOUR",
  "TEMPLATE_TEXT",
  "HR"
];

// types whose data is retrieved asynchronously (we do not import the figma data)
const ASYNC_TYPES = [
  "SIGIL",
  "QR"
];

// these Figma types house children elements, so we need to transverse all children nodes when we find a ROLLED_TYPE
const ROLLED_TYPES = [
  "GROUP",
  "INSTANCE"
]

// removes data portion of Figma name and retrieves component name
const formatName = (type) => {
  return type
    .split(':')[0]
    .replace('>','')
    .toUpperCase();
}

// we use the name as the component ID. for plain text components, we use Figma's type attribute
const getComponent = (child, name) => {
  if (child.type === 'TEXT') return 'TEXT'
  if (TYPES.includes(name)) return name
  if (child === null) return null

  throw new Error(`Child: ${child.type} \n\t with Name: ${name}\n\tnot supported`);
}

const flatPack = (lo) => {
  const extracted = reduce(lo.children, (acc, child) => {

    const name = formatName(child.name)

    if (ROLLED_TYPES.includes(child.type)) {
      // do not traverse into children of sigil and qr
      if (ASYNC_TYPES.includes(name)) return [...acc, {...child, type: name}];
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
  const page = filter(res.data.document.children, page => page.name === KEY)[0]

  const layouts = reduce(page.children, (acc, lo) => {
    return {
      ...acc,
      [lo.name]: {
        key: lo.name,
        absoluteBoundingBox: lo.absoluteBoundingBox,
        renderables: flatPack(lo).map(child => {
          if (child.type === 'QR') {
            return {
              type: 'QR',
              size: child.absoluteBoundingBox.height,
              name: child.name,
              data: child.name.split(':')[1],
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
            };
          };

          if (child.type === 'SIGIL') {
            return {
              type: 'SIGIL',
              size: child.absoluteBoundingBox.height,
              name: child.name,
              data: child.name.split(':')[1],
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
            };
          };

          if (child.type === 'IMG') {
            return {
              type: 'IMG',
              width: child.absoluteBoundingBox.height,
              height: child.absoluteBoundingBox.width,
              name: child.name,
              data: child.name.split(':')[1],
              x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
              y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
            };
          };

          if (child.type === 'TEXT') {
            return {
              type: 'TEXT',
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

          if (child.type === 'TEMPLATE_TEXT') {
            return {
              type: 'TEMPLATE_TEXT',
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

          if (child.type === 'PATQ') {
            return {
              type: 'PATQ',
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

          if (child.type === 'ADDR_SPLIT_FOUR') {
            return {
              type: 'ADDR_SPLIT_FOUR',
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

          if (child.type === 'WRAP_ADDR_SPLIT_FOUR') {
            return {
              type: 'WRAP_ADDR_SPLIT_FOUR',
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

          if (child.type === 'RECT') {
            return {
              type: 'RECT',
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

          if (child.type === 'HR') {
            return {
              type: 'HR',
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
