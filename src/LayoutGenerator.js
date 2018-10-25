import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, reduce } from 'lodash';
import figma from './lib/figma';


const flatPack = (lo) => {
  const extracted = reduce(lo.children, (acc, child) => {
    if (child.type === 'GROUP') {

      // look for special items we don't need to parse
      if (child.name.split(':')[0] === '>qr') return [...acc, {...child, type: 'QR'}];
      if (child.name.split(':')[0] === '>sigil') return [...acc, {...child, type: 'SIGIL'}];
      // if no special items are found, tranverse down into group
      return [...acc, ...flatPack(child)]
    } else {
      if (child.type === 'TEXT') return [...acc, {...child, type: 'TEXT'}];
      console.warn('Reminder: There are more children on board that will not be included in flatpack.')
      return acc
    }
  }, []);
  return extracted
};



class LayoutGenerator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layouts: null,
    }
  }


  componentDidMount = () => {
    figma.pull('a4u6jBsdTgiXcrDGW61q5ngY', res => {

      const _layouts = res.document.children[0].children;

      const layouts = reduce(_layouts, (acc, lo) => {
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

              if (child.type === 'TEXT') {
                return {
                  type: 'TEXT',
                  fontPostScriptName: child.style.fontPostScriptName,
                  fontSize: child.style.fontSize,
                  text: child.characters,
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

      console.log(JSON.stringify(layouts));
    })
  }

  render() {

    return (
      <main id={'page-ref'}>

      </main>
    );
  };
};

export default LayoutGenerator
