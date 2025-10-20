import "reflect-metadata";
import { container, createApp } from "./framework/webserver/index.js";
import config from "./config/config.js";
import serverConfig from "./framework/webserver/server.js";
import type { ILogger } from "./framework/index.js";
import { INTERFACE_TYPE } from "./utils/constants/bindings.js";

const app = createApp();

const logger = container.get<ILogger>(INTERFACE_TYPE.Logger);

// Start database and server

serverConfig(app, config, logger).startServer();
