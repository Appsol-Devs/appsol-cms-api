// index.ts
import "reflect-metadata";
import { container } from "./inversify/container.js";
import { INTERFACE_TYPE } from "./utils/constants/bindings.js";
import type { IApplication } from "./framework/webserver/Application.js";
import type { ILogger } from "./framework/index.js";

const main = async () => {
  try {
    const app = container.get<IApplication>(INTERFACE_TYPE.Application);
    await app.start();

    // Graceful shutdown
    const logger = container.get<ILogger>(INTERFACE_TYPE.Logger);

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully...");
      await app.shutdown();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received, shutting down gracefully...");
      await app.shutdown();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
};

main();
