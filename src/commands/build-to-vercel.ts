import { exec } from "child_process";
import { frontFolder, initializeCommand, sourceFolderPath } from "./common";

export const buildToVercel = () => {
  const docsProcess = exec(
    `${initializeCommand} && npm install && cp -r ${frontFolder}/. ${sourceFolderPath} && exit`
  );

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
