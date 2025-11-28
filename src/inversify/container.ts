// inversify/container.ts
import { Container, type ResolutionContext } from "inversify";
import mongoose from "mongoose";
import type { Mongoose } from "mongoose";
import type { Server as SocketIOServer } from "socket.io";

import { INTERFACE_TYPE } from "../utils/constants/bindings.js";
import { type ILogger, LoggerImpl } from "../framework/logging/index.js";
import { ErrorHandlerImpl } from "../error_handler/errorHandlerImpl.js";
import type { IErrorHandler } from "../error_handler/IErrorHandler.js";
import {
  type IAuthService,
  AuthServiceImpl,
  type IStorageBucket,
  CloudinaryImpl,
  type IMailer,
  MailerImpl,
  type INotificationService,
  NotificationServiceImpl,
} from "../framework/services/index.js";
import { ErrorMiddleware } from "../framework/webserver/middleware/ErrorMiddleware.js";
import { AuthMiddleware } from "../framework/webserver/middleware/AuthMiddleware.js";
import { registerAllBindings } from "./bindings/index.js";

// New imports
import config from "../config/config.js";
import type { IConfig } from "../config/IConfig.js";
import { ExpressApp, type IExpressApp } from "../framework/webserver/app.js";
import { Server, type IServer } from "../framework/webserver/server.js";
import {
  DatabaseConnection,
  type IDatabaseConnection,
} from "../framework/mongodb/connection.js";
import {
  Application,
  type IApplication,
} from "../framework/webserver/Application.js";
import type { IReminderService } from "../framework/services/reminder/IReminderService.js";
import { ReminderService } from "../framework/services/reminder/ReminderServiceImpl.js";
import { ApiKeyMiddleware } from "../framework/webserver/index.js";

const container = new Container();

// Bind configuration (singleton)
container.bind<IConfig>(INTERFACE_TYPE.IConfig).toConstantValue(config);

// Bind Mongoose instance
container.bind<Mongoose>(INTERFACE_TYPE.Mongoose).toConstantValue(mongoose);

// Core services
container
  .bind<ILogger>(INTERFACE_TYPE.Logger)
  .to(LoggerImpl)
  .inSingletonScope();
container
  .bind<IErrorHandler>(INTERFACE_TYPE.ErrorHandler)
  .to(ErrorHandlerImpl)
  .inSingletonScope();

// Middlewares
container
  .bind<AuthMiddleware>(INTERFACE_TYPE.AuthMiddleware)
  .to(AuthMiddleware);
container
  .bind<ErrorMiddleware>(INTERFACE_TYPE.ErrorMiddleWare)
  .to(ErrorMiddleware);
container
  .bind<ApiKeyMiddleware>(INTERFACE_TYPE.ApikeyMiddleware)
  .to(ApiKeyMiddleware);

// Services
container
  .bind<IAuthService>(INTERFACE_TYPE.AuthServiceImpl)
  .to(AuthServiceImpl)
  .inSingletonScope();
container
  .bind<IStorageBucket>(INTERFACE_TYPE.StorageBucketImpl)
  .to(CloudinaryImpl)
  .inSingletonScope();
container
  .bind<IMailer>(INTERFACE_TYPE.Mailer)
  .to(MailerImpl)
  .inSingletonScope();
container
  .bind<IReminderService>(INTERFACE_TYPE.ReminderServiceImpl)
  .to(ReminderService)
  .inSingletonScope();

// Express App (must be bound before Server)
container
  .bind<IExpressApp>(INTERFACE_TYPE.ExpressApp)
  .to(ExpressApp)
  .inSingletonScope();

// Bind Express instance from ExpressApp
container
  .bind(INTERFACE_TYPE.Express)
  .toDynamicValue((context: ResolutionContext) => {
    const expressApp = context.get<IExpressApp>(INTERFACE_TYPE.ExpressApp);
    return expressApp.getApp();
  })
  .inSingletonScope();

// Server (creates Socket.IO)
container.bind<IServer>(INTERFACE_TYPE.Server).to(Server).inSingletonScope();

// Socket.IO instance (from Server)
container
  .bind<SocketIOServer>(INTERFACE_TYPE.SocketIO)
  .toDynamicValue((context) => {
    const server = context.get<IServer>(INTERFACE_TYPE.Server);
    return server.getIO();
  })
  .inSingletonScope();

// Notification Service (depends on SocketIO)
container
  .bind<INotificationService>(INTERFACE_TYPE.NotificationService)
  .to(NotificationServiceImpl)
  .inSingletonScope();

// Database Connection
container
  .bind<IDatabaseConnection>(INTERFACE_TYPE.DatabaseConnection)
  .to(DatabaseConnection)
  .inSingletonScope();

// Register all other bindings
registerAllBindings(container);

container.bind<Container>(INTERFACE_TYPE.Container).toConstantValue(container);

// Application Bootstrap
container
  .bind<IApplication>(INTERFACE_TYPE.Application)
  .to(Application)
  .inSingletonScope();
export { container };
