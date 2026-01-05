import { execSync } from "child_process";
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

// const venvCmd =
// 	platform() === 'win32'
// 		? 'python -m venv venv'
// 		: 'python3 -m venv venv';

// execSync(venvCmd, { cwd: 'backend', stdio: 'inherit' });

// console.log("Setup complete!");
