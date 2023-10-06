import path from "path";
import chokidar from "chokidar";
import fs from "fs-extra";
import { exec } from "child_process";
var clc = require("cli-color");

const sourceFolderPath = process.cwd();

export const dev = () => {
  const watcher = chokidar.watch(sourceFolderPath, {
    ignored: /front/,
    persistent: true,
  });

  console.log("✔ Local Zidocs instance is ready. Launching your site...");
  watcher.on("change", (actualPath: any) => {
    const destinationPath = actualPath.replace(
      sourceFolderPath,
      path.join(sourceFolderPath, "./.front/public/starter-kit")
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

  const cloningCommands = `if [ ! -d .front ] ; then
    git clone https://github.com/zidocs/front.git .front
    cd .front
    rm -rf .git
  fi`;

  const copyStarterKit = `rsync -a -q -i ${sourceFolderPath} ${path.join(
    sourceFolderPath,
    ".front/public"
  )} --exclude .front`;

  const docsProcess = exec(
    `${cloningCommands} && ${copyStarterKit} && cd ${path.join(
      sourceFolderPath,
      ".front"
    )} && npm install && NEXT_PUBLIC_DIR_NAME=${sourceFolderPath} npm run dev`
  );

  if (docsProcess.stdout) {
    docsProcess.stdout.on("data", (data: any) => {
      if (data.includes("Ready in")) {
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
