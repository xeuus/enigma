export function checkCard(card: string) {
  return /\d{16}/g.test(card);
}
