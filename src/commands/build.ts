import { exec } from "child_process";
import { frontFolder, sourceFolderPath, initializeCommand } from "./common";

export const build = () => {
  const command = `${initializeCommand} && npm install && npm run build && cp -r ${frontFolder}/.next ${sourceFolderPath}`;

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
