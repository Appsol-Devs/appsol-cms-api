import express from "express";
import cors from "cors";

import expressConfig from "./express.js";

export const createApp = () => {
  const app = express();

  // Configure express (middlewares, body parser, etc.)
  expressConfig(app);
  app.use(cors());

  return app;
};
