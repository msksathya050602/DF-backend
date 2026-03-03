import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });

export const APPLICATION_NAME = "DF-Backend";

export const CONFIG = Object.freeze({
  database: {
    host: process.env.MASTER_DB_HOST,
    database: process.env.MASTER_DB_DATABASE,
    username: process.env.MASTER_DB_USER,
    password: process.env.MASTER_DB_PASSWORD,
    port: process.env.MASTER_DB_PORT,
    ssl: {
      capath: path.resolve("resources", "rds-ca.pem"),
    },
  },
  server: {
    port: process.env.PORT,
  },
  // Add your custom configs here
});

export const VERSION1 = "/v1";

export const DATABASE_URL = process.env.DATABASE_URL || "";

export const isLocal = process.env.NODE_ENV === "local";
export const isDev = process.env.NODE_ENV === "dev";
export const isProduction = process.env.NODE_ENV === "production";

// Add your environment variables here
export const JWT_KEYS: Readonly<Record<"access" | "refresh", string>> = Object.freeze({
  access: process.env.ACCESS_TOKEN_SECRET!,
  refresh: process.env.REFRESH_TOKEN_SECRET!,
});
