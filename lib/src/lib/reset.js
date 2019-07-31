import {
  isString,
  isFunction,
  isObject,
  isUndefined,
  isRegExp,
  // isArrayBuffer,
} from './utils'


const keys = obj => isObject(obj)
  ? Object.keys(obj)
  : TypeError('Argument to keys() must be type object');


const entries = obj => isObject(obj)
  ? Object.entries(obj)
  : TypeError('Argument to entries() must be type object');


const values = obj => isObject(obj)
  ? Object.values(obj)
  : TypeError('Argument to values() must be type object');



const includes = (arr, any) => Array.isArray(arr)
  ? arr.includes(any)
  : TypeError('Argument to includes() must be type array');



const numToString = (num, rad) => {
  if (!Number.isNumber(num)) TypeError('Argument int to numToString() must be type number');
  if (!isInteger(rad)) TypeError('Argument rad to numToString() must be type integer');
  return num.toString(rad);
};



const split = (str, sep, lim) => {
  if (!isString(str)) TypeError('Argument str to split() must be type string');
  if (!isString(sep) && !isUndefined(sep)) TypeError('Argument sep to split() must be type string');
  if (!isInteger(lim) && !isUndefined(lim)) TypeError('Argument lim to split() must be type integer');
  return str.split(sep, lim);
};



const join = (arr, sep) => {
  if (!Array.isArray(arr)) TypeError('Argument arr to join() must be type array');
  if (!isString(sep) && !isUndefined(sep)) TypeError('Argument sep to join() must be type string');
  return arr.join(sep);
};



const concat = (arr, any) => Array.isArray(arr)
  ? [...arr, any]
  : TypeError('Argument arr to concat() must be type array');



const intToHex = int => isInteger(int)
  ? int.toString(16)
  : TypeError('Argument int to intToHex() must be type int');



const strToHex = str => isString(str)
  ? parseInt(str, 16)
  : TypeError('Argument str to strToHex() must be type string');



// const hexToStr = str => isString(str)
//   ? str.hexDecode()
//   : TypeError('Argument str to hexToStr() must be type string');



const strToBase64Str = str => isString(str)
  ? btoa(str)
  : TypeError('Argument str to strToBase64() must be type string');



const base64StrToStr = base64Str => isString(base64Str)
  ? atob(base64Str)
  : TypeError('Argument base64Str to strToBase64() must be type string');



const sliceString = (str, start, end) => {
  if (!isString(str)) TypeError('Argument arr to slice() must be type arr');
  if (!isInteger(start) && !isUndefined(start)) TypeError('Argument start to slice() must be type int');
  if (!isInteger(end) && !isUndefined(end)) TypeError('Argument end to slice() must be type int');
  return str.slice(start, end);
}



const sliceArray = (arr, start, end) => {
  if (!Array.isArray(arr)) TypeError('Argument arr to slice() must be type arr');
  if (!isInteger(start) && !isUndefined(start)) TypeError('Argument start to slice() must be type int');
  if (!isInteger(end) && !isUndefined(end)) TypeError('Argument end to slice() must be type int');
  return arr.slice(start, end);
}


const isOdd = num => Number.isNumber(num)
  ? !!(num & 1)
  : TypeError('Argument num to isOdd() must be type number');



const isEven = n => Number.isNumber(n)
  ? !(n & 1)
  : TypeError('Argument num to isEven() must be type number');



const indexOf = (arr, any) => Array.isArray(arr)
  ? arr.indexOf(any)
  : TypeError('Argument arr to indexOf() must be type arr');



const match = (str, regexp) => {
  if (!isString(str)) TypeError('Argument str to match() must be type str');
  if (!isRegExp(regexp)) TypeError('Argument regexp to match() must be type regexp');
  return str.match(regexp);
};



const replace = (str, regexp, newSubstr) => {
  if (!isString(str)) TypeError('Argument str to replace() must be type str');
  if (!isString(newSubstr)) TypeError('Argument newSubstr to replace() must be type str');
  if (!isRegExp(regexp)) TypeError('Argument regexp to replace() must be type regexp');
  return str.replace(regexp, newSubstr);
}



const toUpperCase = str => {
  if (!isString(str)) TypeError('Argument str to toUpperCase() must be type str');
  return str.toUpperCase();
}


const toLowerCase = str => {
  if (!isString(str)) TypeError('Argument str to toLowerCase() must be type str');
  return str.toLowerCase();
}



export {
  keys,
  entries,
  values,
  includes,
  numToString,
  intToHex,
  strToHex,
  // hexToStr,
  split,
  concat,
  // int2Hex,
  sliceString,
  sliceArray,
  join,
  isEven,
  isOdd,
  indexOf,
  match,
  strToBase64Str,
  base64StrToStr,
  replace,
  toUpperCase,
  toLowerCase,
}
