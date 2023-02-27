export function joinSentences(arr: string[]) {
  let out = '';
  for (let i = 0; i < arr.length; i++) {
    let sep = '، ';
    if (i === arr.length - 1) sep = '';
    if (i === arr.length - 2) sep = ' و ';
    out += arr[i] + sep;
  }
  return out;
}
