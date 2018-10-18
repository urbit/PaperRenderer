import { map } from 'lodash';


const initCanvas = (canvas, size) => {
  const { x, y } = size;
  let ctx = canvas.getContext('2d');

  let ratio = ctx.webkitBackingStorePixelRatio < 2
    ? window.devicePixelRatio
    : 1;

  // default for high print resolution.
  ratio = ratio * (300/72);

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



const injectContent = (collateral, template) => {
  const FIG_VAR_REGEXP = /(\@)/g;
  return {
    ...collateral,
    renderables: map(template.renderables, renderable => {
      if (renderable.type === 'TEXT') {
        if (renderable.text.match(FIG_VAR_REGEXP)) {
          const target = renderable.text.replace(FIG_VAR_REGEXP, '');
          return {
            ...renderable,
            text: collateral[target],
          }
        } else {
          return renderable;
        };
      };

      if (renderable.type === 'SIGIL') {
        const target = renderable.data.replace(FIG_VAR_REGEXP, '');
        return {
          ...renderable,
          data: collateral[target],
        };
      };

      if (renderable.type === 'QR') {
        const target = renderable.data.replace(FIG_VAR_REGEXP, '');
        return {
          ...renderable,
          data: collateral[target],
        };
      };

    }),
  };
};

const inject = (collateral, templates) => {
  return map(templates, template => injectContent(collateral, template))
}


export {
  initCanvas,
  dataURItoBlob,
  wordWrap,
  injectContent,
  inject,
}
