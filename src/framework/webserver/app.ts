import express from "express";
import cors from "cors";

import expressConfig from "./express.js";
import routes from "./routes/index.js";
import { container } from "../../inversify/container.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import type { ErrorMiddleware } from "./middleware/ErrorMiddleware.js";

export const createApp = () => {
  const app = express();

  // Configure express (middlewares, body parser, etc.)
  // Routes
  expressConfig(app);

  app.use(
    cors({
      origin: "*",
      exposedHeaders: [
        "Content-Length",
        "x-pagination",
        "x-total-amount",
        "x-total-approved",
        "x-total-pending",
      ],
    })
  );

  app.use(routes);

  // Error middleware
  const errorMiddleware = container.get<ErrorMiddleware>(
    INTERFACE_TYPE.ErrorMiddleWare
  );
  app.use(errorMiddleware.execute().bind(errorMiddleware));

  return app;
};
