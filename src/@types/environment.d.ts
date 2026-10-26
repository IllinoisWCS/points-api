declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    SESSION_SECRET: string;
    MONGODB_URI: string;
    BASE_URL: string;
    CHECK_IN_GRACE_PERIOD: string;
    CALLBACK_URL: string;
    JWT_SECRET: string;
    NOTION_MAP_TOKEN: string;
    NOTION_MAP_DATABASE_ID: string;
  }
}
