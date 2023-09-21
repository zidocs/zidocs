import path from "path";
import chokidar from "chokidar";
import fs from "fs-extra";
import { exec } from "child_process";

const sourceFolderPath = process.cwd();

export const dev = () => {
  const watcher = chokidar.watch(sourceFolderPath, {
    ignored: /front/,
    persistent: true,
  });

  watcher.on("change", (actualPath: any) => {
    const destinationPath = actualPath.replace(
      sourceFolderPath,
      path.join(sourceFolderPath, "./.front/public/starter-kit")
    );

    const fileName = actualPath.split("/").at(-1);

    console.log(` ○ File ${fileName} has changed. Compiling...\n`);

    fs.ensureFile(destinationPath)
      .then(() => {
        return fs.copyFile(actualPath, destinationPath);
      })
      .then(() => {
        //console.log(`File copied successfully.`);
      })
      .catch((error: any) => {
        console.error(`Error copying file: ${error}`);
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
      console.log("Zidocs project has stopped.");
    } else {
      console.error(`Zidocs project exited with code ${code}`);
    }
  });
};
