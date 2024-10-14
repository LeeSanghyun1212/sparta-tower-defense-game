import { PrismaClient } from "@prisma/client";

export const usersPrisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});
