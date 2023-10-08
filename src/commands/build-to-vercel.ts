import { exec } from "child_process";

const sourceFolderPath = process.cwd();

export const buildToVercel = () => {
  const cloningCommands = `if [ ! -d ~/.front ] ; then
    cd
    git clone https://github.com/zidocs/front.git .front
    cd .front
    rm -rf .git
  fi`;

  const copyStarterKitOne = `cp -r . ~/starter-kit && cd ~/starter-kit && ls`;
  const copyStarterKit = `cp -r ~/starter-kit ~/.front/public && cd ~/.front/public && ls`;

  const docsProcess = exec(
    `${copyStarterKitOne} && ${cloningCommands} && ${copyStarterKit} && cd ~/.front && npm install && cp -r ~/.front/. ${sourceFolderPath} && exit`
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
