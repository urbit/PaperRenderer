import { pour } from 'sigil-js';
import PlainSVGStringRenderer from './PlainSVGStringRenderer';
import qr from 'qr-image';
import { wordWrap } from './walletRenderer'

const drawSigil = ({ctx, data, x, y, size}) => {
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
  let img = new Image;
  img.onload = () => ctx.drawImage(img, x, y);
  img.src = image64;
}



const drawQR = ({ctx, data, x, y, size}) => {
  size = size / (ctx.canvas.height * 8 / ctx.canvas.clientHeight)
  const svg = qr.imageSync(data, {
    type: 'svg',
    size,
    margin: 0
  });
  const svg64 = btoa(svg);
  const b64Start = 'data:image/svg+xml;base64,';
  const image64 = b64Start + svg64;
  let img = new Image;
  img.onload = () => ctx.drawImage(img, x, y);
  img.src = image64;
}



const drawText = ({ctx, fontSize, lineHeightPx, maxWidth, x, y, fontPostScriptName, text }) => {
  ctx.font = `${fontSize}px ${fontPostScriptName}`;
  ctx.fillText(text, x, y+lineHeightPx);
}

const drawWrappedText = ({ctx, fontSize, lineHeightPx, maxWidth, x, y, fontPostScriptName, text }) => {
  console.log(text)
  ctx.font = `${fontSize}px ${fontPostScriptName}`;
  wordWrap(ctx, text, x, y+lineHeightPx, lineHeightPx, maxWidth);
}

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
}
