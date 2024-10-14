import { PrismaClient as userDataClient } from "../../../prisma/user/generated/userDataClient/index.js";

export const usersPrisma = new userDataClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});
