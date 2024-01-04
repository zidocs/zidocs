import chokidar from "chokidar";
import fs from "fs-extra";
import { exec } from "child_process";
import {
  frontFolder,
  initializeCommand,
  sourceFolderPath,
  spinner,
  writeToLastLine,
} from "./common";
var clc = require("cli-color");

export const dev = async () => {
  spinner.start();

  const watcher = chokidar.watch(sourceFolderPath, {
    ignored: /front/,
    persistent: true,
  });

  watcher.on("change", (actualPath: any) => {
    const destinationPath = actualPath.replace(
      sourceFolderPath,
      `${frontFolder}/public`
    );

    const fileName = actualPath.split("/").at(-1);

    console.log(`Z File ${fileName} has changed. Compiling...`);

    fs.ensureFile(destinationPath)
      .then(() => {
        return fs.copyFile(actualPath, destinationPath);
      })
      .then(() => {
        console.log(
          clc.greenBright(`Z File ${fileName} changed successfully.`)
        );
      })
      .catch((error: any) => {
        console.error(clc.redBright(`Z Error copying file: ${error}`));
      });
  });

  await initializeCommand();
  const docsProcess = exec(`npm install && npm run dev`);

  if (docsProcess.stdout) {
    docsProcess.stdout.on("data", (data: any) => {
      if (data.includes("Ready in")) {
        spinner.stop();
        writeToLastLine(
          `${clc.greenBright(
            "✔"
          )} Local Zidocs instance is ready. Launching your site...`
        );

        console.log(
          clc.cyanBright("\nZ Press Ctrl+C any time to stop the local preview")
        );
      }

      if (data.includes("http")) {
        spinner.stop();
        const url = data
          .split(" ")
          .find((str: string) => str.startsWith("http"));
        console.log(
          clc.cyanBright(`\nZ Your local preview is available at ${url.trim()}`)
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
