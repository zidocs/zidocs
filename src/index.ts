#! /usr/bin/env node

const { Command } = require("commander");
const { exec } = require("child_process"); // add this line
const figlet = require("figlet");
const path = require("path");
const chokidar = require("chokidar");
const fs = require("fs-extra");

const sourceFolderPath = process.cwd();

const watcher = chokidar.watch(sourceFolderPath, {
  ignored: /front/,
  persistent: true,
});

const program = new Command();

console.log(figlet.textSync("zidocs"));

program.version("0.1.0").description("Build awesome docs").parse(process.argv);

const options = program.opts();

if (program.args[0] === "dev") {
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

  const cloneFront = `git clone https://github.com/zidocs/front.git .front`;

  const copyStarterKit = `rsync -a -q -i --progress ${sourceFolderPath} ${path.join(
    sourceFolderPath,
    ".front/public"
  )} --exclude .front`;

  const docsProcess = exec(
    `${cloneFront} && ${copyStarterKit} && cd ${path.join(
      sourceFolderPath,
      ".front"
    )} && npm install && NEXT_PUBLIC_DIR_NAME=${sourceFolderPath} npm run dev`
  );

  docsProcess.stdout.on("data", (data: any) => {
    console.log(data);
  });

  docsProcess.stderr.on("data", (data: any) => {
    console.error(data);
  });

  docsProcess.on("close", (code: any) => {
    if (code === 0) {
      console.log("Next.js project has stopped.");
    } else {
      console.error(`Next.js project exited with code ${code}`);
    }
  });
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
