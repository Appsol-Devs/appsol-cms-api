// configure ports and urls here with secrete keys
import dotenv from "dotenv";
import type { IConfig } from "./IConfig.js";

dotenv.config();
const config: IConfig = {
  port: Number(process.env["PORT"]) || 3001, // Convert the env variable to a number
  mongo: {
    uri:
      process.env["NODE_ENV"] === "production"
        ? process.env["MONGO_DB_URI_PROD"] || "" // Use production database URI
        : process.env["MONGO_DB_URI_DEV"] || "",
  },

  permissionKey: process.env["PERMISSION_KEY"] || "",
};

export default config;
