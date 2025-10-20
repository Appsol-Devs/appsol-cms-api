import { Container } from "inversify";

import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import { type ILogger, LoggerImpl } from "../logging/index.js";

const container = new Container();

container.bind<ILogger>(INTERFACE_TYPE.Logger).to(LoggerImpl);

export { container };
