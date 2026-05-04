import express from "express";
import { initiateRegister, resendOtp, verifyOtp, loginUser } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password required" });
        const result = await initiateRegister({ email, password });
        res.status(201).json(result);
    } catch (err) {
        if (err.code === "EMAIL_EXISTS")
            return res.status(409).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
});

router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });
        const result = await resendOtp({ email });
        res.json(result);
    } catch (err) {
        if (err.code === "INVALID_REQUEST")
            return res.status(400).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ error: "Email and OTP required" });
        const result = await verifyOtp({ email, otp });
        res.json(result);
    } catch (err) {
        if (err.code === "INVALID_OTP")
            return res.status(400).json({ error: err.message });
        if (err.code === "INVALID_REQUEST")
            return res.status(400).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password required" });
        const result = await loginUser({ email, password });
        res.json(result);
    } catch (err) {
        if (err.code === "INVALID_CREDENTIALS")
            return res.status(401).json({ error: err.message });
        if (err.code === "EMAIL_NOT_VERIFIED")
            return res.status(403).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
});

export default router;
