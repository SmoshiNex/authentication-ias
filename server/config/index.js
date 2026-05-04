import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!process.env.DB_URL) {
    console.warn(
        "Warning: DB_URL is not set. Migrations and runtime DB access will fail without it.",
    );
}
if (!JWT_SECRET) {
    console.warn(
        "Warning: JWT_SECRET is not set. Set JWT_SECRET in your .env for secure tokens.",
    );
}

const prisma = new PrismaClient();

export { prisma, JWT_SECRET };
