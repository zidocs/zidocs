#! /usr/bin/env node

import { Command } from "commander";
import { dev, install, build } from "./commands";

const program = new Command();

program.version("0.1.0").description("Build awesome docs").parse(process.argv);

if (program.args[0] === "dev") dev();
if (program.args[0] === "build") build();
if (program.args[0] === "install") install();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
