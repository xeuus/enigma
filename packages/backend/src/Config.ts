import { Env, Service } from 'feret';
import path from 'path';

@Service()
export class Config {
  @Env('4000')
  PORT!: string;

  @Env('mongodb://localhost:27017/enigma')
  DB_URI!: string;

  @Env('cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2')
  JWT_SECRET!: string;

  @Env(path.resolve('./public'))
  PUBLIC_DIR!: string;

  @Env('30')
  TOKEN_DURATION_SHORT!: string;

  @Env('43200')
  TOKEN_DURATION_LONG!: string;
}
