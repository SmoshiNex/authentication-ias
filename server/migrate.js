import { spawnSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const args = process.env.npm_config_fresh === "true" || process.argv.includes("--fresh");
const fresh = args;

function run(cmd, args) {
    console.log(`> ${cmd} ${args.join(" ")}`);
    const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
    if (res.status !== 0) process.exit(res.status);
}

if (fresh) {
    run("npx", ["prisma", "migrate", "reset", "--force", "--skip-seed"]);
} else {
    run("npx", ["prisma", "migrate", "dev", "--name", "init"]);
}

run("npx", ["prisma", "generate"]);

console.log("Migrations complete.");
