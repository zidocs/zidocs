#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import { dev, install } from "./commands";

const program = new Command();

console.log(figlet.textSync("zidocs"));

program.version("0.1.0").description("Build awesome docs").parse(process.argv);

if (program.args[0] === "dev") dev();
if (program.args[0] === "install") install();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
