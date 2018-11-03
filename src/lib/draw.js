import { wordWrap } from './utils'


const drawQR = ({ ctx, img, x, y, size, type }) => ctx.drawImage(img, x, y, size, size)

const drawSigil = ({ ctx, img, x, y, size, type }) => ctx.drawImage(img, x, y, size, size)



const drawText = ({ctx, fontSize, lineHeightPx, maxWidth, x, y, fontPostScriptName, text, type }) => {
  ctx.font = `${fontSize}px ${fontPostScriptName}`;
  ctx.fillText(text, x, y+lineHeightPx);
};


const drawWrappedText = ({ctx, fontSize, lineHeightPx, maxWidth, x, y, fontPostScriptName, text, type }) => {
  ctx.font = `${fontSize}px ${fontPostScriptName}`;
  wordWrap(ctx, text, x, y+lineHeightPx, lineHeightPx, maxWidth);
};


const drawEthereumAddressCompact = ({ ctx, fontSize, lineHeightPx, x, y, fontPostScriptName, text }) => {


  const _0x = text.substring(0, 2);
  const rest = text.substring(2);

  // 20 is ethereum addr length without the 0x
  const row1 = rest.substring(0, 20);
  const row2 = rest.substring(20);

  // size is the number of chars per space gapped char group
  const size = 4;

  const re = new RegExp('.{1,' + size + '}', 'g');
	const row1c = row1.match(re);
  const row2c = row2.match(re);

  const row1r = [_0x, ...row1c].join(' ');
  const row2r = row2c.join(' ');

  ctx.font = `${fontSize}px ${fontPostScriptName}`;

  ctx.fillText(row1r, x, y + lineHeightPx);
  ctx.fillText(row2r, x + (ctx.measureText('0x ').width), y + (lineHeightPx * 2));
}



const drawEthereumAddressLong = ({ ctx, fontSize, lineHeightPx, x, y, fontPostScriptName, text }) => {
  const _0x = text.substring(0, 2);
  const rest = text.substring(2);

  const size = 4;

  const re = new RegExp('.{1,' + size + '}', 'g');
  const chunks = rest.match(re);

  const newText = [_0x, ...chunks].join(' ')

  ctx.font = `${fontSize}px ${fontPostScriptName}`;

  ctx.fillText(newText, x, y+lineHeightPx);

}



const drawPatQ = ({ ctx, fontSize, lineHeightPx, x, y, fontPostScriptName, text }) => {
  ctx.font = `${fontSize}px ${fontPostScriptName}`;

  if (text.length === 28) {
    ctx.fillText(text, x, y+lineHeightPx);
    return
  }

  if (text.length === 56) {
    const line1 = text.substring(0, 28);
    const line2 = text.substring(28);
    ctx.fillText(line1, x, y + lineHeightPx);
    ctx.fillText(line2, x, y + (lineHeightPx * 2));
    return
  }

  if (text.length === 112) {
    const line1 = text.substring(0, 28);
    const line2 = text.substring(28, 56);
    const line3 = text.substring(56, 84);
    const line4 = text.substring(84);
    ctx.fillText(line1, x, y + lineHeightPx);
    ctx.fillText(line2, x, y + (lineHeightPx * 2));
    ctx.fillText(line3, x, y + lineHeightPx * 3);
    ctx.fillText(line4, x, y + (lineHeightPx * 4));
    return
  }

  throw Error(`patq ${text} of length ${text.length} supplied to drawPatQ is unsupported`)
}


export {
  drawSigil,
  drawQR,
  drawText,
  drawWrappedText,
  drawEthereumAddressCompact,
  drawEthereumAddressLong,
  drawPatQ,
}
