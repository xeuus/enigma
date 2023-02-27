export function checkMobile(mobile: string) {
  return /(09)\d{9}/g.test(mobile);
}
