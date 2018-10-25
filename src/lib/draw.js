import { pour } from 'sigil-js';
import PlainSVGStringRenderer from './PlainSVGStringRenderer';
import qr from 'qr-image';
import { wordWrap } from './walletRenderer'


const loadImg = (base64, cb) => new Promise(resolve => {
  const img = new Image();
  img.onload = () => resolve(cb(img));
  img.onerror = () => reject('Error loading image');
  img.src = base64;
});


const loadQR = ({ ctx, data, x, y, size, type }) => {
  size = size / (ctx.canvas.height * 8 / ctx.canvas.clientHeight);
  const svg = qr.imageSync(data, {
    type: 'svg',
    size,
    margin: 0,
  });
  const svg64 = btoa(svg);
  const b64Start = 'data:image/svg+xml;base64,';
  const image64 = b64Start + svg64;
  return loadImg(image64, img => ({ ctx, img, x, y, size, type }));
}



const loadSigil = ({ ctx, data, x, y, size, type }) => {
  const svg = pour({
    size: size,
    patp: data,
    colorway: ['white', 'black'],
    renderer: PlainSVGStringRenderer,
    margin: 'auto',
  });
  const svg64 = btoa(svg);
  const b64Start = 'data:image/svg+xml;base64,';
  const image64 = b64Start + svg64;
  return loadImg(image64, img => ({ ctx, img, x, y, size, type }));
}



const drawQR = ({ ctx, img, x, y, size, type }) => {
  ctx.drawImage(img, x, y)
}


const drawSigil = ({ ctx, img, x, y, size, type }) => {
  ctx.drawImage(img, x, y)
}


const drawText = ({ctx, fontSize, lineHeightPx, maxWidth, x, y, fontPostScriptName, text, type }) => {
  ctx.font = `${fontSize}px ${fontPostScriptName}`;
  ctx.fillText(text, x, y+lineHeightPx);
};


const drawWrappedText = ({ctx, fontSize, lineHeightPx, maxWidth, x, y, fontPostScriptName, text, type }) => {
  ctx.font = `${fontSize}px ${fontPostScriptName}`;
  wordWrap(ctx, text, x, y+lineHeightPx, lineHeightPx, maxWidth);
};


const drawEthereumAddressCompact = ({ ctx, fontSize, lineHeightPx, x, y, fontPostScriptName, text }) => {

}



const drawEthereumAddressLong = ({ ctx, fontSize, lineHeightPx, x, y, fontPostScriptName, text }) => {

}



const drawPatQ = ({ ctx, fontSize, lineHeightPx, x, y, fontPostScriptName, text }) => {

}


export {
  drawSigil,
  drawQR,
  drawText,
  drawWrappedText,
  loadQR,
  loadSigil,
}
