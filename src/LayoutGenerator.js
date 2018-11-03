import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { map, reduce, filter } from 'lodash';
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
      if (child.name.split(':')[0] === '>patq') return [...acc, {...child, type: 'PATQ'}];
      if (child.name.split(':')[0] === '>addr_long') return [...acc, {...child, type: 'ADDR_LONG'}];
      if (child.name.split(':')[0] === '>addr_compact') return [...acc, {...child, type: 'ADDR_COMPACT'}];

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

      const KEY = 'Layouts-rc-0.1'
      const page = filter(res.document.children, page => page.name === KEY)[0]

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

              if (child.type === 'PATQ') {
                return {
                  type: 'PATQ',
                  fontPostScriptName: child.style.fontPostScriptName,
                  fontSize: child.style.fontSize,
                  text: child.characters.split(':')[1],
                  maxWidth: child.absoluteBoundingBox.width,
                  lineHeightPx: child.style.lineHeightPx,
                  x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
                  y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
                };
              };

              if (child.type === 'ADDR_LONG') {
                return {
                  type: 'ADDR_LONG',
                  fontPostScriptName: child.style.fontPostScriptName,
                  fontSize: child.style.fontSize,
                  text: child.characters.split(':')[1],
                  maxWidth: child.absoluteBoundingBox.width,
                  lineHeightPx: child.style.lineHeightPx,
                  x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
                  y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
                };
              };

              if (child.type === 'ADDR_COMPACT') {
                return {
                  type: 'ADDR_COMPACT',
                  fontPostScriptName: child.style.fontPostScriptName,
                  fontSize: child.style.fontSize,
                  text: child.characters.split(':')[1],
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
