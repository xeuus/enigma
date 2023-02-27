const replacements = new Map([
  ['ك', 'ک'],
  ['دِ', 'د'],
  ['بِ', 'ب'],
  ['زِ', 'ز'],
  ['ذِ', 'ذ'],
  ['شِ', 'ش'],
  ['سِ', 'س'],
  ['ى', 'ی'],
  ['ي', 'ی'],
  ['١', '۱'],
  ['٢', '۲'],
  ['٣', '۳'],
  ['٤', '۴'],
  ['٥', '۵'],
  ['٦', '۶'],
  ['٧', '۷'],
  ['٨', '۸'],
  ['٩', '۹'],
  ['٠', '۰'],
]);
export function persianify(str: unknown) {
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
