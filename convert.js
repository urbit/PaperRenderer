require('dotenv').config()
const { map, reduce, filter } = require('lodash');
const Figma = require('figma-js');
const fs = require('fs')

const OUTPUT_PATH = __dirname + '/src/js/templates.json'

// to add new figma components to be parsed, add a new value to TYPES
const TYPES = [
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
  "hr",
  "rect"
];

// examples -->
// if (child.name.split(':')[0] === '>qr') return [...acc, {...child, type: 'QR'}];
// if (child.type === "TEXT") return [...acc, {...child, type: 'TEXT'}];

// checks for children that are included in TYPES
const findType = (child, t) => new Promise(resolve => {
  if (child.type === 'TEXT') t = child.type;
  else t = child.name.split(':')[0].replace('>','');

  if(TYPES.includes(t.toLowerCase()))
    t = t.toUpperCase();
  return '';
});


const flatPack = (lo) => {
  const extracted = reduce(lo.children, (acc, child) => {

    const t = '';

    if (child.type === 'GROUP' || child.type === 'INSTANCE') {
        // look for special items we don't need to parse
        findType(child, t => t);
        if (t != '') return [...acc, {...child, type: t}];

        // if no special items are found, tranverse down into group
        return [...acc, ...flatPack(child)];
    } else {
        findType(child, t => t);
        if (t != '') return [...acc, {...child, type: t}];
        // console.warn('Reminder: There are more children on board that will not be included in flatpack.')
        return acc
    }

  }, []);

  return extracted

};

//
// function findType(child){
//     var type = child.name.split(':')[0].replace('>',''); // ex: '>qr'--> 'qr'
//     if (TYPES.includes(type))
//       return child;
//     return '';
// }
//
// const flatPack = (lo) => {
//   const extracted = reduce(lo.children, (acc, child) => {
//
//     // figma groups and instances (layouts such as VotingLayout) need special parsing
//     var t = '';
//     if (child.type === 'GROUP'){
//       try {
//         t = findType(child);
//       }
//       catch(err) {
//         console.log('could not find child');
//       }
//       if (t != '') return [...acc, {...child, type: t }];
//       return [...acc, ...flatPack(child)];
//     }
//
//     // else if (child.type === 'INSTANCE'){
//     //   for (i of child.children) {
//     //     return findChild(acc, child); }
//     // }
//
//     else {
//       t = findType(child);
//       if (t != '') return [...acc, {...child, type: t }];
//       return acc;
//     }
//
//   return extracted;
//
//   });
// }

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
})
