const replacements = new Map([
  ['۰', '0'],
  ['۱', '1'],
  ['۲', '2'],
  ['۳', '3'],
  ['۴', '4'],
  ['۵', '5'],
  ['۶', '6'],
  ['۷', '7'],
  ['۸', '8'],
  ['۹', '9'],
  ['١', '1'],
  ['٢', '2'],
  ['٣', '3'],
  ['٤', '4'],
  ['٥', '5'],
  ['٦', '6'],
  ['٧', '7'],
  ['٨', '8'],
  ['٩', '9'],
  ['٠', '0'],
]);

export function numberify(str: unknown) {
  let out = '';
  for (const chr of String(str)) {
    if (replacements.has(chr)) {
      out += replacements.get(chr);
    } else {
      out += chr;
    }
  }
  return out;
}

const numbers = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function onlyNumbers(str: unknown) {
  let out = '';
  for (const chr of String(str)) {
    if (numbers.has(chr)) {
      out += chr;
    }
  }
  return out;
}
