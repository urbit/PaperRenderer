import { get } from 'lodash';
import {tierOfadd, patp} from 'urbit-ob';
import flatten from 'flat'
// import { values, match, replace } from './reset';

const PAT = /(\@)/g;


const initCanvas = (canvas, size, ratio) => {
  const { x, y } = size;
  let ctx = canvas.getContext('2d');

  // offset since canvas renders half a pixel larger
  ctx.translate(.5,.5);
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


const shortDateToDa = (d, mil) => {
  var fil = function(n) {
    return n >= 10 ? n : "0" + n;
  };
  return (
    `${d.getUTCFullYear()}.` +
    `${(d.getUTCMonth() + 1)}.` +
    `${fil(d.getUTCDate())}`
  );
}



const retrieve = (obj, path) => {
  const result = get(obj, path)
  if (result === undefined) {
   throw new Error(`Tried to get item at path ${path} from object ${JSON.stringify(obj, null, 2)} and failed.`)
  } else {
    return result;
  };
}


const getTicketSize = (seedName, classOf) => {
  // if (seedName === 'masterTicket' && classOf === 'galaxy') return '384 Bits'
  if (seedName === 'masterTicketShard' && classOf === 'galaxy') return '256 Bits'
  if (seedName === 'masterTicket' && classOf === 'planet') return '64 Bits'
  return '128 Bits'
}

const getCustodyLevel = (classOf) => {
  if (classOf === 'planet') return 'Low'
  if (classOf === 'star') return 'Medium'
  return 'High'
}

const getTitleByClass = (classOf) => {
  if (classOf === 'planet') return 'Mangement Proxy'
  return 'Spawn Proxy'
}

// transform the wallet from keygen-js into a shape more easily iterable
const shim = kg_wallet => {
  const reshaped = Object.entries(kg_wallet).map(([shipAddr, shipWallet]) => {
    const shipClass = tierOfadd(parseInt(shipAddr));
    return {
      ...shipWallet,
      ship: {
        patp: patp(parseInt(shipAddr)),
        addr: shipAddr,
        class: shipClass,
      },
    }
  });
  return reshaped;
};



const mapInsert = (c, t) => Object.values(t.renderables).map(r => insert(flatten(c), r));

const insert = (fc, r) => {
  const { type, text, data } = r;
  if (type === 'text') {
    // if this is a template variable, replace the @key with actual data
    if (text.match(PAT)) return {...r, text: retrieve(fc, text.replace(PAT, '')) };
    return r;
  };
  if (type === 'template_text') return {...r, text: retrieve(fc, text.replace(PAT, '')) };
  if (type === 'addr_split_four') return {...r, text: retrieve(fc, text.replace(PAT, '')) };
  if (type === 'wrap_addr_split_four') return {...r, text: retrieve(fc, text.replace(PAT, '')) };
  if (type === 'patq') return {...r, text: retrieve(fc, text.replace(PAT, '')) };
  if (type === 'sigil') return {...r, img: retrieve(fc, data.replace(PAT, '')) };
  if (type === 'qr') return {...r, img: retrieve(fc, data.replace(PAT, '')) };
  if (type === 'hr') return {...r, data: r };
  if (type === 'rect') return {...r, data: r };
  if (type === 'img') return {...r, img: retrieve(fc, data.replace(PAT, '')) };
  // return {...r, img: r };
  throw new Error(`insert() cannot find a renderables for type: ${type}`);
};



const assignBin = (classOf, pageType) => {
  if (classOf === 'galaxy') {
    if (pageType === 'masterTicket') return '1';
    // if (pageType === 'masterTicketShard') return '1';
    // if (pageType === 'spawn') return '2';
    // if (pageType === 'voting') return '3';
    if (pageType === 'management') return '3';
    // if (pageType === 'transfer') return '1';
    // if (pageType === 'public') return '0';
    // if (pageType === 'manifest') return '0';
    // if (pageType === 'multipass') return ??;
  };

  if (classOf === 'star') {
    if (pageType === 'masterTicket') return '2';
    // if (pageType === 'masterTicketShard') return '2';
    // if (pageType === 'spawn') return '3';
    if (pageType === 'management') return '3';
    // if (pageType === 'transfer') return '2';
    // if (pageType === 'public') return '0';
    // if (pageType === 'manifest') return '0';
    // if (pageType === 'multipass') return ??;
  };

  if (classOf === 'planet') {
    if (pageType === 'masterTicket') return '3';
    // if (pageType === 'masterTicketShard') return '3';
    if (pageType === 'management') return '4';
    // if (pageType === 'transfer') return '3';
    // if (pageType === 'public') return '0';
    // if (pageType === 'manifest') return '0';
    // if (pageType === 'multipass') return ??;
  };
};


export {
  initCanvas,
  dataURItoBlob,
  wordWrap,
  dateToDa,
  shortDateToDa,
  retrieve,
  getTicketSize,
  getCustodyLevel,
  getTitleByClass,
  shim,
  mapInsert,
  assignBin,
}
