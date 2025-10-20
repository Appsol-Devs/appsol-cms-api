import { Container } from "inversify";

import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import { type ILogger, LoggerImpl } from "../logging/index.js";
import { ErrorHandlerImpl } from "../../error_handler/errorHandlerImpl.js";
import type { IErrorHandler } from "../../error_handler/IErrorHandler.js";
import {
  type IAuthService,
  AuthServiceImpl,
  type IStorageBucket,
  CloudinaryImpl,
} from "../services/index.js";
import { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";

const container = new Container();

container.bind<ILogger>(INTERFACE_TYPE.Logger).to(LoggerImpl);
container.bind<IErrorHandler>(INTERFACE_TYPE.ErrorHandler).to(ErrorHandlerImpl);
container
  .bind<IAuthService>(INTERFACE_TYPE.AuthServiceImpl)
  .to(AuthServiceImpl);
container
  .bind<ErrorMiddleware>(INTERFACE_TYPE.ErrorMiddleWare)
  .to(ErrorMiddleware);
container
  .bind<IStorageBucket>(INTERFACE_TYPE.StorageBucketImpl)
  .to(CloudinaryImpl);

export { container };
