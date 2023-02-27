declare namespace NodeJS {
  interface ProcessEnv {
    readonly PORT: string;
    readonly DB_URI: string;
    readonly JWT_SECRET: string;
  }
}
