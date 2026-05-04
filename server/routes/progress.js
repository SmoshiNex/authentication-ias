import express from "express";
import jwt from "jsonwebtoken";
import { prisma, JWT_SECRET } from "../config/index.js";

const router = express.Router();

// Middleware: verify JWT and attach userId
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET || "dev-secret");
        req.userId = payload.sub;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// GET /api/progress — return all completed steps for the user
router.get("/", auth, async (req, res) => {
    try {
        const rows = await prisma.progress.findMany({
            where: { userId: req.userId },
            select: { moduleId: true, stepId: true, completedAt: true },
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/progress — mark a step complete (upsert — safe to call multiple times)
router.post("/", auth, async (req, res) => {
    try {
        const { moduleId, stepId } = req.body;
        if (!moduleId || !stepId)
            return res.status(400).json({ error: "moduleId and stepId required" });

        const row = await prisma.progress.upsert({
            where: { userId_moduleId_stepId: { userId: req.userId, moduleId, stepId } },
            update: {},
            create: { userId: req.userId, moduleId, stepId },
        });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
