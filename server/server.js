import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { prisma } from "./config/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
