declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    SESSION_SECRET: string;
    MONGODB_URI: string;
    BASE_URL: string;
    CHECK_IN_GRACE_PERIOD: string;
  }
}
