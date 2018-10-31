import { map, get, isUndefined } from 'lodash';
import ob from 'urbit-ob';


const initCanvas = (canvas, size, ratio) => {
  const { x, y } = size;
  let ctx = canvas.getContext('2d');

  // let ratio = ctx.webkitBackingStorePixelRatio < 2
  //   ? window.devicePixelRatio
  //   : 1;

  // default for high print resolution.
  // ratio = ratio * resMult;


  canvas.width = x * ratio;
  canvas.height = y * ratio;
  canvas.style.width = x + 'px';
  canvas.style.height = y + 'px';

  canvas.getContext('2d').scale(ratio, ratio);

  return canvas;
}



const dataURItoBlob = dataURI => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs
  const byteString = atob(dataURI.split(',')[1]);
  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  // create a view into the buffer
  let ia = new Uint8Array(ab);
  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], {type: mimeString});
  return blob;
}


const wordWrap = (context, text, x, y, lineHeight, fitWidth) => {
  text = text.toString()
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0)
    {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
    }
    if  (idx > 0)
        context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
}


const dateToDa = (d, mil) => {
  var fil = function(n) {
    return n >= 10 ? n : "0" + n;
  };
  return (
    `~${d.getUTCFullYear()}.` +
    `${(d.getUTCMonth() + 1)}.` +
    `${fil(d.getUTCDate())}..` +
    `${fil(d.getUTCHours())}.` +
    `${fil(d.getUTCMinutes())}.` +
    `${fil(d.getUTCSeconds())}` +
    `${mil ? "..0000" : ""}`
  );
}



const retrieve = (obj, path) => {
  const result = get(obj, path)
  if (isUndefined(result)) {
   throw new Error(`Tried to get item at path ${path} from object ${JSON.stringify(obj, null, 2)} and failed.`)
  } else {
    return result;
  };
}


const getTicketSize = (seedName, classOf) => {
  if (seedName === 'masterTicket' && classOf === 'galaxy') return '384 Bits'
  if (seedName === 'masterTicketShard' && classOf === 'galaxy') return '128 Bits'
  if (seedName === 'masterTicket' && classOf === 'planet') return '64 Bits'
  return '128 Bits'
}



// transform the wallet from keygen-js into a shape more easily iterable
const shim = kg_wallet => {
  const reshaped = Object.entries(kg_wallet).map(([shipAddr, shipWallet]) => {
    const shipClass = ob.tierOfadd(parseInt(shipAddr));
    return {
      ...shipWallet,
      ship: {
        patp: ob.add2patp(parseInt(shipAddr)),
        addr: shipAddr,
        class: shipClass,
      },
    }
  });
  return reshaped;
};


export {
  initCanvas,
  dataURItoBlob,
  wordWrap,
  dateToDa,
  retrieve,
  getTicketSize,
  shim,
}
