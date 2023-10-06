import path from "path";
import { exec } from "child_process";

const sourceFolderPath = process.cwd();

export const build = () => {
  const cloningCommands = `if [ ! -d .front ] ; then
    cd
    git clone https://github.com/zidocs/front.git .front
    cd .front
    rm -rf .git
  fi`;

  const copyStarterKit = `cd && cp -r ${sourceFolderPath} ${path.join(
    sourceFolderPath,
    ".front/public"
  )}`;

  const docsProcess = exec(
    `${cloningCommands} && ${copyStarterKit} && cd ${path.join(
      sourceFolderPath,
      ".front"
    )} && npm install && npm run build && exit`
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
