import path from "path";
import { exec } from "child_process";

const sourceFolderPath = process.cwd();

export const install = () => {
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
    )} && npm install && exit`
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
      console.log("Zidocs installation completed.");
    } else {
      console.error(`Zidocs installation exited with code ${code}`);
    }
  });
};
