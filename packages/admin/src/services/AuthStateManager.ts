import { Bootable, Observable, Service, Tagged } from 'feret';
import type {
  LoginRequest,
  RegisterRequest,
  User,
  UserCredentials,
} from 'interfaces';
import { COOKIE_EMBEDDED, SSR_EMBEDDED } from 'services/constants';
import { AuthService } from './AuthService';

@Service('auth')
export class AuthStateManager implements Bootable {
  @Observable()
  @Tagged(COOKIE_EMBEDDED)
  private credentials?: UserCredentials;

  @Observable()
  @Tagged(SSR_EMBEDDED)
  private user?: User;

  constructor(private readonly authService: AuthService) {}

  async onBoot() {
    if (!this.isLoggedIn()) return;
    await this.updateUser(this.getCredentials()!);
  }

  async login(request: LoginRequest) {
    const creds = await this.authService.login(request);
    return () => this.updateUser(creds);
  }

  async register(request: RegisterRequest) {
    const creds = await this.authService.register(request);
    return () => this.updateUser(creds);
  }

  private async updateUser(credentials: UserCredentials) {
    try {
      this.credentials = credentials;
      if (this.user) return;
      this.user = await this.authService.getUser();
    } catch (e) {
      console.log(e);
      this.credentials = undefined;
      this.user = undefined;
    }
  }

  logout() {
    this.credentials = undefined;
    this.user = undefined;
  }

  isLoggedIn() {
    return Boolean(this.credentials);
  }

  getCredentials() {
    return this.credentials;
  }

  getUser() {
    return this.user;
  }
}
