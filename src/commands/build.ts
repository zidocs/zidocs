import path from "path";
import { exec } from "child_process";
import {
  cloneFrontCommand,
  copyStarterKitCommandToFront,
  homeDir,
} from "./common";

const sourceFolderPath = process.cwd();

export const build = () => {
  const command = `mkdir ${homeDir}/.zidocs && cd ~/.zidocs && cp -r ${path.join(
    sourceFolderPath,
    "/."
  )} ${homeDir}/.zidocs/starter-kit && ${cloneFrontCommand} && ${copyStarterKitCommandToFront} && cd ${homeDir}/.zidocs/.front && npm install && npm run build && cp -r ${homeDir}/.zidocs/.front/.next ${sourceFolderPath}`;

  const docsProcess = exec(`${command} && exit`);

  if (docsProcess.stdout) {
    docsProcess.stdout.on("data", (data: any) => {
      console.log(data);
    });
  }

  if (docsProcess.stderr) {
    docsProcess.stderr.on("data", (data: any) => {
      console.error(data);
    });
  }

  docsProcess.on("close", (code: any) => {
    if (code === 0) {
      console.log("Zidocs build completed.");
    } else {
      console.error(`Zidocs build exited with code ${code}`);
    }
  });
};
