import express from "express";
import { registerUser, loginUser } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ error: "email and password required" });
        const result = await registerUser({ email, password });
        res.status(201).json(result);
    } catch (err) {
        if (err.code === "EMAIL_EXISTS")
            return res.status(409).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ error: "email and password required" });
        const result = await loginUser({ email, password });
        res.json(result);
    } catch (err) {
        if (err.code === "INVALID_CREDENTIALS")
            return res.status(401).json({ error: err.message });
        res.status(500).json({ error: err.message });
    }
});

export default router;
