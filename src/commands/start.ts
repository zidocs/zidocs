import { exec } from "child_process";
import { initializeCommand } from "./common";
var clc = require("cli-color");

export const start = async () => {
  await initializeCommand();

  const docsProcess = exec(`npm run build && npm run start && exit`);

  if (docsProcess.stdout) {
    docsProcess.stdout.on("data", (data: any) => {
      if (data.includes("Ready in")) {
        console.log("✔ Local Zidocs instance is ready. Launching your site...");
        console.log(
          clc.cyanBright("Z Press Ctrl+C any time to stop the local preview")
        );
      }

      if (data.includes("http")) {
        const url = data
          .split(" ")
          .find((str: string) => str.startsWith("http"));
        console.log(
          clc.cyanBright(`Z Your local preview is available at ${url.trim()}`)
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
      console.log("Zidocs build completed.");
    } else {
      console.log(
        clc.redBright(
          `Z Zidocs build failure... Try to run ${clc.cyanBright(
            "zidocs build"
          )} first...`
        )
      );
    }
  });
};
