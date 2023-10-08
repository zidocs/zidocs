import path from "path";
import { homedir } from "os";

export const homeDir = homedir();

export const cloneFrontCommand = `if [ ! -d .front ] ; then
  cd ${homeDir}/.zidocs
  git clone https://github.com/zidocs/front.git ./.front
  cd .front
  rm -rf .git
fi`;

export const copyStarterKitCommandToFront = `cp -r ${homeDir}/.zidocs/starter-kit ${homeDir}/.zidocs/.front/public`;
export const copyStarterKitCommandToZidocs = (sourcePath: string) => {
  return `cp -r ${path.join(sourcePath, "/.")} ${homeDir}/.zidocs/starter-kit`;
};
