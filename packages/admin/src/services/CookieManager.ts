import { Service } from 'feret';

@Service()
export class CookieManager {
  set(key: string, value: string | undefined, expireAt?: Date, path = '/') {
    let cookie = `${key}=${value ? encodeURI(String(value)) : ''}`;
    if (expireAt) cookie += `; expires=${expireAt.toUTCString()}`;
    cookie += `; path=${path}`;
    document.cookie = cookie;
  }
  get(key: string): string {
    const r = new RegExp(`(?:^|;|\\s)${key}\=(.*?)(?:;|$|\\s)`, 'g');
    const match = r.exec(document.cookie);
    if (!match) return '';
    return decodeURI(match[1]);
  }
  erase(key: string) {
    document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}
