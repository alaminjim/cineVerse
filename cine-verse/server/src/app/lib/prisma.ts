import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { getPrismaClientClass } from "../../generated/prisma/internal/class.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const PrismaClient = getPrismaClientClass();
const prisma = new PrismaClient({ adapter });

export { prisma };
