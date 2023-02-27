export function checkIban(iban: string) {
  const chars = '1827';
  const a = iban.replace(/( |IR)/g, '');
  if (a.length !== 24) return false;
  const val = BigInt(a.substring(2) + chars + a.slice(0, 2));
  return Number(val % BigInt(97)) === 1;
}
