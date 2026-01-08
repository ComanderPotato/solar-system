import { exec, execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { platform } from "os";
import path from "path";

console.log("Installing root dependencies...");
execSync("npm install", { stdio: "inherit" });

console.log("Installing frontend dependencies...");
execSync("npm install", { cwd: "frontend", stdio: "inherit" });

const backendStaticSrc = path.join("backend", "public");
if (!existsSync(backendStaticSrc)) {
  console.log(`Creating directory: ${backendStaticSrc}`);
  mkdirSync(backendStaticSrc, { recursive: true });
}

console.log("Creating Python virtual environment...");

const virtualEnvPath = path.join("backend", ".venv");
const isWin = process.platform === "win32";
if (!existsSync(virtualEnvPath)) {
  const venvCmd = isWin
    ? `python -m venv ${virtualEnvPath}`
    : `python3 -m venv ${virtualEnvPath}`;

  execSync(venvCmd, { cwd: "backend", stdio: "inherit" });
  console.log("Setup complete!");
}
const activateCmd = path.join(
  virtualEnvPath,
  isWin ? "Scripts" : "bin",
  "activate",
);
// console.log(activateCmd);

console.log(activateCmd);
// execSync(isWin ? activateCmd : `source ${activateCmd}`, {
//   cwd: "backend",
//   stdio: "inherit",
// });
