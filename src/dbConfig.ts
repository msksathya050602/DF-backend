import fs from "fs";
import path from "path";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { CONFIG, isProduction } from "@/config";
// Import your entities here
import { Branch } from "@/entities/Branch";
import { Category } from "@/entities/Category";
import { Customer } from "@/entities/Customer";
import { Pricing } from "@/entities/Pricing";
import { Product } from "@/entities/Product";
import { Service } from "@/entities/Service";
import { User } from "@/entities/User";

function loadCaPem(): string | undefined {
  const fromEnv = process.env.PG_SSL_CA || CONFIG.database?.ssl?.capath;
  if (!fromEnv) return undefined;

  const caPath = path.isAbsolute(fromEnv) ? fromEnv : path.resolve(fromEnv);
  if (!fs.existsSync(caPath)) {
    throw new Error(
      `PG SSL CA file not found at ${caPath}. Mount the CA bundle and set PG_SSL_CA or CONFIG.database.ssl.caPath.`,
    );
  }
  const pem = fs.readFileSync(caPath, "utf8").trim();
  if (!pem.includes("BEGIN CERTIFICATE")) {
    throw new Error(`PG SSL CA at ${caPath} is not a PEM file (missing BEGIN CERTIFICATE).`);
  }
  return pem;
}

const caPem = isProduction ? loadCaPem() : undefined;
const ssl = isProduction
  ? caPem
    ? { ca: caPem, rejectUnauthorized: true }
    : { rejectUnauthorized: true }
  : false;

const dbConfigOptions: PostgresConnectionOptions = {
  type: "postgres",
  host: CONFIG.database.host,
  port: Number(CONFIG.database.port),
  username: CONFIG.database.username,
  password: CONFIG.database.password,
  database: CONFIG.database.database,
  synchronize: false,
  // ssl: ssl,

  logger: "advanced-console",
  entities: [Branch, User, Customer, Category, Product, Service, Pricing],
  migrations: [`${__dirname}/migrations/*.{js,ts}`],
};

export const dbSource: DataSource = new DataSource(dbConfigOptions);
