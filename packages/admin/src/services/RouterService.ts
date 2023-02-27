import { Service } from 'feret';

@Service()
export class RouterService {
  authRoutes = {
    login: '/login',
    forgot: '/forgot',
    signUp: '/sign-up',
  };
  dasboardRoutes = {
    dashboard: '/'
  };
}
