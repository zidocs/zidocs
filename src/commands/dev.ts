import chokidar from "chokidar";
import fs from "fs-extra";
import { exec } from "child_process";
import { homedir } from "os";

import {
  cloneFrontCommand,
  copyStarterKitCommandToFront,
  copyStarterKitCommandToZidocs,
} from "./common";
var clc = require("cli-color");

const sourceFolderPath = process.cwd();
const homeDir = homedir();

export const dev = () => {
  const watcher = chokidar.watch(sourceFolderPath, {
    ignored: /front/,
    persistent: true,
  });

  // TODO: AJEITAR ISSO
  watcher.on("change", (actualPath: any) => {
    const destinationPath = actualPath.replace(
      sourceFolderPath,
      `${homeDir}/.zidocs/.front/public/starter-kit`
    );

    const fileName = actualPath.split("/").at(-1);

    console.log(`Z File ${fileName} has changed. Compiling...`);

    fs.ensureFile(destinationPath)
      .then(() => {
        return fs.copyFile(actualPath, destinationPath);
      })
      .then(() => {
        console.log(clc.greenBright(`Z File copied successfully.`));
      })
      .catch((error: any) => {
        console.error(clc.redBright(`Z Error copying file: ${error}`));
      });
  });

  const docsProcess = exec(
    `mkdir ${homeDir}/.zidocs && cd ${homeDir}/.zidocs && ${copyStarterKitCommandToZidocs(
      sourceFolderPath
    )} && ${cloneFrontCommand} && ${copyStarterKitCommandToFront} && cd ${homeDir}/.zidocs/.front && npm install && npm run dev`
  );

  if (docsProcess.stdout) {
    docsProcess.stdout.on("data", (data: any) => {
      if (data.includes("Ready in")) {
        console.log("✔ Local Zidocs instance is ready. Launching your site...");

        console.log(
          clc.magentaBright("Z Press Ctrl+C any time to stop the local preview")
        );
      }

      if (data.includes("http")) {
        const url = data
          .split(" ")
          .find((str: string) => str.startsWith("http"));
        console.log(
          clc.magentaBright(
            `Z Your local preview is available at ${url.trim()}`
          )
        );
      }
    });
  }

  if (docsProcess.stderr) {
    docsProcess.stderr.on("data", (data: any) => {
      console.error(data);
    });
  }

  docsProcess.on("close", (code: any) => {
    if (code === 0) {
      console.log("Zidocs project has stopped.");
    } else {
      console.error(`Zidocs project exited with code ${code}`);
    }
  });
};
