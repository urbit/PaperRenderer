require('dotenv').config()
const { map, reduce, filter } = require('lodash');
const Figma = require('figma-js');
const fs = require('fs')

const OUTPUT_PATH = __dirname + '/src/js/templates.json'

const flatPack = (lo) => {
  const extracted = reduce(lo.children, (acc, child) => {
    if (child.type === 'GROUP') {
      // look for special items we don't need to parse
      if (child.name.split(':')[0] === '>qr') return [...acc, {...child, type: 'QR'}];
      if (child.name.split(':')[0] === '>sigil') return [...acc, {...child, type: 'SIGIL'}];
      if (child.name.split(':')[0] === '>img') return [...acc, {...child, type: 'IMG'}];
      if (child.name.split(':')[0] === '>rect') return [...acc, {...child, type: 'RECT'}];
      if (child.name.split(':')[0] === '>hr') return [...acc, {...child, type: 'HR'}];
      // if no special items are found, tranverse down into group
      return [...acc, ...flatPack(child)]
    } else {
      if (child.name.split(':')[0] === '>patq') return [...acc, {...child, type: 'PATQ'}];
      if (child.name.split(':')[0] === '>addr_split_four') return [...acc, {...child, type: 'ADDR_SPLIT_FOUR'}];
      if (child.name.split(':')[0] === '>wrap_addr_split_four') return [...acc, {...child, type: 'WRAP_ADDR_SPLIT_FOUR'}];
      if (child.name.split(':')[0] === '>template_text') return [...acc, {...child, type: 'TEMPLATE_TEXT'}];
      if (child.type === 'TEXT') return [...acc, {...child, type: 'TEXT'}];
      // console.warn('Reminder: There are more children on board that will not be included in flatpack.')
      return acc
    }
  }, []);
  return extracted
};
const TOKEN = process.env.FIGMA_API_TOKEN

const client = Figma.Client({ personalAccessToken: TOKEN })

client.file('a4u6jBsdTgiXcrDGW61q5ngY').then(res => {

  const KEY = 'Registration 1.1'
  const page = filter(res.data.document.children, page => page.name === KEY)[0]

  const layouts = reduce(page.children, (acc, lo) => {
    return {
      ...acc,
      [lo.name]: {
        key: lo.name,
        absoluteBoundingBox: lo.absoluteBoundingBox,
        renderables: map(flatPack(lo), child => {
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
              size: child.absoluteBoundingBox.height,
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
