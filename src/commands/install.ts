import { exec } from "child_process";
import { initializeCommand, zidocsFolder } from "./common";

export const install = () => {
  const command = `rm -rf ${zidocsFolder} && ${initializeCommand} && npm install`;

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
