import { Bootable, Service, TagManager } from 'feret';
import { COOKIE_EMBEDDED, STORAGE_EMBEDDED } from './constants';
import { CookieManager } from './CookieManager';

@Service()
export class Storage implements Bootable {
  constructor(
    private readonly tagManager: TagManager,
    private readonly cookieManager: CookieManager,
  ) {}

  onBoot() {
    try {
      this.tagManager.restoreSnapshot(__INITIAL_DATA__);

      const storageData = localStorage.getItem('app_saved_data') || '{}';
      this.tagManager.restoreSnapshot(JSON.parse(storageData));
      const cookieData = this.cookieManager.get('app_saved_data') || '{}';
      this.tagManager.restoreSnapshot(JSON.parse(cookieData));
    } catch {}
    window.addEventListener('beforeunload', () => {
      localStorage.setItem(
        'app_saved_data',
        JSON.stringify(this.tagManager.getSnapshot(STORAGE_EMBEDDED)),
      );
      const cookies = JSON.stringify(
        this.tagManager.getSnapshot(COOKIE_EMBEDDED),
      );
      if (cookies.length >= 4096)
        throw new Error('failed to store cookies, size is over 4096');
      this.cookieManager.set('app_saved_data', cookies);
    });
  }
}
