
const imgBase(child, name) = {
  return {
    type: name,
    size: child.absoluteBoundingBox.height,
    name: child.name,
    data: child.name.split(':')[1],
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
  }
}

const qr(child) = {
  return {
    imgBase(child, "qr")
  };
};

const sigil(child) = {
  return {
    imgBase(child, "sigil")
  };
};

const img(child) = {
  const i = imgBase(child, "img")
  i.width = child.absoluteBoundingBox.height
  i.height = child.absoluteBoundingBox.width
  return i
};

const textBase(child){
  return {
    type: "",
    fontFamily: child.style.fontFamily,
    fontSize: child.style.fontSize,
    fontWeight: child.style.fontWeight,
    maxWidth: child.absoluteBoundingBox.width,
    lineHeightPx: child.style.lineHeightPx,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    fontColor: child.fills,
  }
}


const text(child) = {
  return {

    text: child.characters,

  };
};

const template_text(child) = {
  return {
    text: child.name.split(':')[1],
  };
};

const patq(child) = {
  return {
    type: 'patq',
    text: child.name.split(':')[1],
  };
};

const addr_split_four = {
  return {
    text: child.name.split(':')[1],
  };
};

const wrap_addr_split_four = {
  return {
    text: child.name.split(':')[1],
  };
};

const shapeBase = {
  return {
    type: 'rect',
    cornerRadius: child.cornerRadius,
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    strokeColor: child.strokes,
    strokeWeight: child.strokeWeight,
  };
};

const rect = {
  const r = shapeBase(child, "rect")
  r.fillColor = child.fills

  return r
};

const hr = {
  const h = shapeBase(child, "hr")
  
  return {
    type: 'hr',
    dashes: child.strokeDashes,
    x: child.absoluteBoundingBox.x - lo.absoluteBoundingBox.x,
    y: child.absoluteBoundingBox.y - lo.absoluteBoundingBox.y,
    width: child.absoluteBoundingBox.width,
    height: child.absoluteBoundingBox.height,
    strokeColor: child.strokes,
    strokeWeight: child.strokeWeight,
  };
};
