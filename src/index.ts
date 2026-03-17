import { Database } from "@components/database";
import { Server, ServerConfig } from "@components/server";
import { retryWithBackoff } from "@helpers/retryWithBackoff";
import { healthStatusChecker } from "@helpers/status";
import { globalErrorHandler } from "@middlewares/error";
import { APPLICATION_NAME, CONFIG, isLocal, VERSION1 } from "./config";
import { dbSource } from "./dbConfig";
import specs from "./openapi";
import logger from "@helpers/logger";
import { log } from "@middlewares/log";
import V1Routes from "@routes/v1_routes";
import { getClientIp } from "@helpers/getClientIp";

const initializeDatabase = Database.initialize(dbSource);
const connectDatabase = initializeDatabase.connect.bind(initializeDatabase);
const closeDatabase = initializeDatabase.close.bind(initializeDatabase);

const serverOptions: ServerConfig = {
  APPLICATION_NAME,
  logger: logger,
  defaultPort: Number(CONFIG.server.port) || 3000,
  middlewares: {
    cors: {
      origin: "http://localhost:3000",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders:
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, X-Filename",
    },
    rateLimit: {
      windowMs: 2 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: any) => req.ip,
      skip: (req) => req.method === "OPTIONS" || req.path === "/health",
      handler: (_req, res) => {
        logger.error(
          "[RATE LIMIT] Too many requests. Please try again later. Request IP: " +
            getClientIp(_req),
        );
        return res.status(429).json({
          error: "[RATE LIMIT] Too many requests. Please try again later.",
        });
      },
      message: {
        message: "[RATE LIMIT] Too many requests, please try again later.",
        status: 429,
      },
    },
    helmet: true,
    bodyParser: {
      limit: "10mb",
    },
    cookieParser: true,
    additional: [log],
  },
  routeConfig: [
    {
      prefix: isLocal ? "/api/v1" : VERSION1,
      route: V1Routes(),
    },
  ],
  errorHandler: globalErrorHandler,
  openAPI: {
    path: isLocal ? "/api/docs" : "/docs",
    specs,
  },
  terminusOptions: {
    onSignal: async () => {
      logger.info(`[Server]: cleanup started`);
      await closeDatabase();
    },
    onShutdown: async () => {
      logger.info(`[Server]: cleanup finished, server shutdown`);
    },
    healthChecks: {
      "/healthcheck": async () => {
        return await healthStatusChecker();
      },
    },
  },
};

const initializeApp = async () => {
  try {
    // Connect to database first
    await connectDatabase();
    logger.info("[Database]: Database connected successfully");

    // Then initialize and start the server
    const initializeServer = Server.initialize(serverOptions);
    const startServer = initializeServer.start.bind(initializeServer);
    startServer();
  } catch (error: any) {
    console.error(error);
    logger.error(`[Initialization Error]: Failed to initialize - ${JSON.stringify(error)}`);
    throw error;
  }
};

retryWithBackoff(() => initializeApp().then(() => true), 5, 1000)
  .then(() => {
    logger.info("[Server]: Server started");
  })
  .catch((error) => {
    logger.error(`[Initialization Error]: Failed to initialize - ${JSON.stringify(error)}`);
    process.exit(1);
  });
