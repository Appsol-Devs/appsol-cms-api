import { PrismaClient } from "../generated/prisma/client.js";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "../../../config/config.js";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const connectionString =
  process.env["POSTGRES_URL"]?.trim() ||
  process.env["DATABASE_URL"]?.trim() ||
  config.postgres.url?.trim() ||
  `postgresql://${config.postgres.user}:${encodeURIComponent(config.postgres.password)}@${config.postgres.host}:${config.postgres.port}/${config.postgres.database}`;

const adapter = new PrismaPg({ connectionString });
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}
