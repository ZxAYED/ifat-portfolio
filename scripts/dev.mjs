// Next's CLI uses --hostname; preview runners commonly supply --host.
// This adapter keeps `npm run dev` portable without changing the application.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const mode = process.env.PORTFOLIO_PREVIEW_MODE === "production" ? "start" : "dev";
const args = process.argv.slice(2).filter(arg => arg !== "--strictPort").map(arg => arg === "--host" ? "--hostname" : arg);
if (!args.includes("--hostname") && !args.some(arg => arg.startsWith("--hostname="))) args.push("--hostname", "0.0.0.0");
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), mode, ...args], { stdio: "inherit", env: process.env });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", code => process.exit(code ?? 1));
