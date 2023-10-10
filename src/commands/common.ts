import path from "path";
import fs from "fs-extra";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import { homedir } from "os";
import { rimraf } from "rimraf";
import { Spinner } from "cli-spinner";

export const homeDir = homedir();
export const zidocsFolder = `${homeDir}/.zidocs`;
export const frontFolder = `${zidocsFolder}/.front`;
export const starterKitFolder = `${zidocsFolder}/starter-kit`;
export const spinner = new Spinner();
spinner.setSpinnerString(
  ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].join("")
);
spinner.setSpinnerTitle("Preparing local Zidocs instance...");

// DOC: Diretorio atual onde a cli esta sendo chamada!
export const sourceFolderPath = process.cwd();

// DOC: Clona o projeto frontend se não existir a pasta .front!
export const cloneFrontCommand = async () => {
  if (!fs.existsSync(frontFolder)) {
    await git.clone({
      fs,
      http: http,
      dir: frontFolder,
      url: "https://github.com/zidocs/front.git",
    });
  }
};

// DOC: Cria a pasta .zidocs se não existir!
export const ensureZidocsFolder = () => {
  if (!fs.existsSync(zidocsFolder)) {
    fs.mkdir(zidocsFolder, (err) => {
      if (err) console.log("Error while trying to create zidocs folder");
    });
  }
};

export const ensureStarterKitCommandToFront = async () => {
  if (fs.existsSync(`${frontFolder}/public/starter-kit`)) {
    await rimraf(`${frontFolder}/public/starter-kit`);
  }
  await fs.copy(starterKitFolder, `${frontFolder}/public/starter-kit`);
};

// DOC: Copia a pasta do starter-kit para dentro do .zidocs e se existir remove para copiar um novo!
export const ensureStarterKitCommandToZidocs = async (sourcePath: string) => {
  if (fs.existsSync(starterKitFolder)) {
    await rimraf(starterKitFolder);
  }

  await fs.copy(path.join(sourcePath, "/."), starterKitFolder);
};

// DOC: Comando inicial que engloba todas os comandos iniciais!
export const initializeCommand = async () => {
  ensureZidocsFolder();

  await ensureStarterKitCommandToZidocs(sourceFolderPath);

  await cloneFrontCommand();

  await ensureStarterKitCommandToFront();

  process.chdir(path.resolve(frontFolder));
};

export const writeToLastLine = (str: string) => {
  process.stdout.moveCursor(0, -1); // up one line
  process.stdout.clearLine(1); // from cursor to end
  process.stdout.write(`\n${str}`);
};
