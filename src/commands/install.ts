import { exec } from "child_process";
import {
  cloneFrontCommand,
  copyStarterKitCommandToFront,
  copyStarterKitCommandToZidocs,
  homeDir,
} from "./common";

const sourceFolderPath = process.cwd();

export const install = () => {
  const command = `mkdir ${homeDir}/.zidocs && cd ~/.zidocs && ${copyStarterKitCommandToZidocs(
    sourceFolderPath
  )} && ${cloneFrontCommand} && ${copyStarterKitCommandToFront} && cd ${homeDir}/.zidocs/.front && npm install`;

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
      console.log("Zidocs installation completed.");
    } else {
      console.error(`Zidocs installation exited with code ${code}`);
    }
  });
};
