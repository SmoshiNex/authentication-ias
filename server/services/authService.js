import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma, JWT_SECRET } from "../config/index.js";
import { sendOtpEmail } from "./emailService.js";

const SALT_ROUNDS = 10;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

export async function initiateRegister({ email, password }) {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing?.emailVerified) {
        const err = new Error("Email already in use");
        err.code = "EMAIL_EXISTS";
        throw err;
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

    // Upsert: create or overwrite a pending (unverified) registration
    await prisma.user.upsert({
        where: { email },
        update: { password: hash, otpCode: otp, otpExpiresAt },
        create: { email, password: hash, otpCode: otp, otpExpiresAt, emailVerified: false },
    });

    await sendOtpEmail(email, otp);
    return { message: "OTP sent" };
}

export async function verifyOtp({ email, otp }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerified) {
        const err = new Error("Invalid request");
        err.code = "INVALID_REQUEST";
        throw err;
    }

    if (user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        const err = new Error("Invalid or expired code");
        err.code = "INVALID_OTP";
        throw err;
    }

    const verified = await prisma.user.update({
        where: { email },
        data: { emailVerified: true, otpCode: null, otpExpiresAt: null },
    });

    return { user: { id: verified.id, email: verified.email }, token: signToken(verified) };
}

export async function loginUser({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        const err = new Error("Invalid credentials");
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }

    if (!user.emailVerified) {
        const err = new Error("Please verify your email before signing in");
        err.code = "EMAIL_NOT_VERIFIED";
        throw err;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        const err = new Error("Invalid credentials");
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }

    return { user: { id: user.id, email: user.email }, token: signToken(user) };
}

function signToken(user) {
    return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}
