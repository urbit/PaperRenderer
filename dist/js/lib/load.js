import qr from 'qr-image';
import { sigil, stringRenderer } from 'urbit-sigil-js';


const loadImg = (base64, cb) => new Promise(resolve => {
  const img = new Image();
  img.onload = () => resolve(cb(img));
  img.onerror = () => reject('Error loading image');
  img.src = base64;
});



const DATA_URI_PREFIX = 'data:image/svg+xml;base64,';



const loadQR = (size, data) => {
  const svg = qr.imageSync(data, {
    type: 'svg',
    size,
    margin: 0,
  });
  const svg64 = btoa(svg);
  const image64 = DATA_URI_PREFIX + svg64;
  return loadImg(image64, img => img);
}



const loadSigil = (size, patp) => {
  const svg = sigil({
    patp,
    renderer: stringRenderer,
    size: size,
    colors: ['white', 'black'],
  });
  const svg64 = btoa(svg);
  const image64 = DATA_URI_PREFIX + svg64;
  return loadImg(image64, img => img);
}



export {
  loadImg,
  loadQR,
  loadSigil,
}
