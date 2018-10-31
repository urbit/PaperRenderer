import { wordWrap } from './utils'


const drawQR = ({ ctx, img, x, y, size, type }) => {
  ctx.drawImage(img, x, y, size, size)
}


const drawSigil = ({ ctx, img, x, y, size, type }) => {
  ctx.drawImage(img, x, y, size, size)

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
