import path from "path";
import { homedir } from "os";

export const homeDir = homedir();
export const zidocsFolder = `${homeDir}/.zidocs`;
export const frontFolder = `${zidocsFolder}/.front`;
export const starterKitFolder = `${zidocsFolder}/starter-kit`;

// DOC: Diretorio atual onde a cli esta sendo chamada!
export const sourceFolderPath = process.cwd();

// DOC: Clona o projeto frontend se não existir a pasta .front!
export const cloneFrontCommand = `if [ ! -d ${frontFolder} ] ; then
  cd ${zidocsFolder}
  git clone https://github.com/zidocs/front.git ${frontFolder}
  cd ${frontFolder}
  rm -rf .git
fi`;

// DOC: Cria a pasta .zidocs se não existir!
export const ensureZidocsFolder = `if [ ! -d ${zidocsFolder} ] ; then
  mkdir ${zidocsFolder}
  cd ${zidocsFolder}
fi`;

// DOC: Cria a pasta .zidocs se não existir!
export const ensureStarterKitCommandToFront = `if [ -d ${frontFolder}/public/starter-kit ] ; then
    rm -rf ${frontFolder}/public/starter-kit 
  fi
  cp -r ${starterKitFolder} ${frontFolder}/public`;

// DOC: Copia a pasta do starter-kit para dentro do .zidocs e se existir remove para copiar um novo!
export const ensureStarterKitCommandToZidocs = (sourcePath: string) => {
  return `if [ -d ${starterKitFolder} ] ; then
    rm -rf ${starterKitFolder}
  fi
  cp -r ${path.join(sourcePath, "/.")} ${starterKitFolder}`;
};

// DOC: Comando inicial que engloba todas os comandos iniciais!
export const initializeCommand = `${ensureZidocsFolder} && ${ensureStarterKitCommandToZidocs(
  sourceFolderPath
)} && ${cloneFrontCommand} && ${ensureStarterKitCommandToFront} && cd ${frontFolder}`;
