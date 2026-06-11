#!/usr/bin/env node

import { existsSync } from "node:fs";
import { cp, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const targetArg = process.argv[2] ?? "my-site";
const target = resolve(process.cwd(), targetArg);
const template = fileURLToPath(new URL("template", import.meta.url));

if (existsSync(target) && (await readdir(target)).length > 0) {
	console.error(`Error: directory "${target}" already exists and is not empty.`);
	console.error("Choose a different name or remove the directory first.");
	process.exit(1);
}

await cp(template, target, { recursive: true });

// npm strips dotfiles when publishing, so the template ships a dotless "gitignore"
await rename(join(target, "gitignore"), join(target, ".gitignore"));

const packageFile = join(target, "package.json");
const pkg = JSON.parse(await readFile(packageFile, "utf8"));
pkg.name = basename(target);
await writeFile(packageFile, `${JSON.stringify(pkg, null, "\t")}\n`);

console.log(`Scaffolded a new Sphido site in ${target}

Next steps:

  cd ${targetArg}
  npm install
  node index.js
`);
