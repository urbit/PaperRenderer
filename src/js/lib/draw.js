import { wordWrap } from './utils'


const drawQR = ({ ctx, img, x, y, size, type }) => ctx.drawImage(img, x, y+3, size, size)

const drawSigil = ({ ctx, img, x, y, size, type }) => ctx.drawImage(img, x, y, size, size)

const drawImg = ({ ctx, img, x, y, size, type }) => ctx.drawImage(img, x, y, size, size)


const drawText = ({ctx, fontWeight, fontSize, lineHeightPx, maxWidth, x, y, fontFamily, text, type }) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  // const offset = fontFamily === 'Source Code Pro' ? 1 : 0
  ctx.fillText(text, x, y+lineHeightPx);
};


const drawWrappedText = ({ctx, fontWeight, fontSize, lineHeightPx, maxWidth, x, y, fontFamily, text, type }) => {

  // const offset = fontFamily === 'Source Code Pro' ? 1 : 0
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  wordWrap(ctx, text, x, y+lineHeightPx, lineHeightPx, maxWidth);
};


const drawEthereumAddressCompact = ({ ctx, fontWeight, fontSize, lineHeightPx, x, y, fontFamily, text }) => {


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

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  ctx.fillText(row1r, x, y + lineHeightPx);
  ctx.fillText(row2r, x + (ctx.measureText('0x ').width), y + (lineHeightPx * 2));
}



const drawEthereumAddressLong = ({ ctx, fontWeight, fontSize, lineHeightPx, x, y, fontFamily, text }) => {
  const _0x = text.substring(0, 2);
  const rest = text.substring(2);

  const size = 4;

  const re = new RegExp('.{1,' + size + '}', 'g');
  const chunks = rest.match(re);

  const newText = [_0x, ...chunks].join(' ')

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  ctx.fillText(newText, x, y+lineHeightPx);

}

const drawPatQ = ({ ctx, fontSize, lineHeightPx, x, y, fontFamily, text }) => {
  ctx.font = `${fontSize}px ${fontFamily}`;

  const OFFSET = 1.2;

  var start = 0, end = 0, offset = 1;

  for(var lineNum = 1; lineNum < text.length/28; lineNum++){
    // 28 chars per line, unless string is < 28
    end = text.length > 28 ? 28 : text.length;

    ctx.fillText(text, x, y+lineHeightPx * lineNum) * offset;

    // no offset on first line
    offset = OFFSET;

    // remove drawn text for next iteration
    text = text.substring(end);
  }

}



const drawRect = ({ ctx, cornerRadius, dashes, x, y, width, height, fillColors, strokeColors, strokeWeight}) => {

  var fillColor, strokeColor;
  if (fillColors.length > 0) {
    fillColor = fillColors[0];
  }
  if (strokeColors.length > 0) {
    strokeColor = strokeColors[0];
  }

  ctx.strokeStyle = strokeColor === "" ? fillColor : strokeColor;
  ctx.lineWidth = (strokeWeight != null && strokeWeight > 0) ? strokeWeight : 1;
  ctx.setLineDash(dashes);

  if(cornerRadius > 0) {
    // Rounded corners are created with round stroke border
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    // Compensate for the round stroke border by decreasing rect dimensions
    x += cornerRadius/2;
    y += cornerRadius/2;
    width -= cornerRadius;
    height -= cornerRadius;

    ctx.strokeRect(x, y, width, height);
  }

  if(fillColor === "") {
    ctx.strokeRect(x, y, width, height);
  }

  else {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);
  }
}


const drawLine = ({ ctx, dashes, x, y, width, height, strokeColors, strokeWeight}) => {
  console.log(dashes);
  var strokeColor;
  if (strokeColors.length > 0) {
    strokeColor = strokeColors[0];
  }

  ctx.strokeStyle = strokeColor === "" ? "#000000" : strokeColor;
  ctx.lineWidth = (strokeWeight != null && strokeWeight > 0) ? strokeWeight : 1;
  ctx.setLineDash(dashes);

  x2 = x + width;
  y2 = y + height;

  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x2,y2);
  ctx.stroke();

}

export {
  drawSigil,
  drawQR,
  drawImg,
  drawText,
  drawWrappedText,
  drawEthereumAddressCompact,
  drawEthereumAddressLong,
  drawPatQ,
  drawRect,
  drawLine,
}
