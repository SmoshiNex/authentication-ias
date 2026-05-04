import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma, JWT_SECRET } from "../config/index.js";

const SALT_ROUNDS = 10;

export async function registerUser({ email, password }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        const err = new Error("Email already in use");
        err.code = "EMAIL_EXISTS";
        throw err;
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({ data: { email, password: hash } });
    const token = signToken(user);
    return { user: { id: user.id, email: user.email }, token };
}

export async function loginUser({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const err = new Error("Invalid credentials");
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        const err = new Error("Invalid credentials");
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }

    const token = signToken(user);
    return { user: { id: user.id, email: user.email }, token };
}

function signToken(user) {
    const payload = { sub: user.id, email: user.email };
    const secret = JWT_SECRET || "dev-secret";
    return jwt.sign(payload, secret, { expiresIn: "7d" });
}
