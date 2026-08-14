import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const bin = fileURLToPath(new URL("../bin.js", import.meta.url));
const template = fileURLToPath(new URL("../template", import.meta.url));

function runBin(cwd, ...args) {
	return spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" });
}

describe("create-sphido bin", () => {
	let cwd;

	beforeEach(async () => {
		cwd = await mkdtemp(join(tmpdir(), "create-sphido-"));
	});

	afterEach(async () => {
		await rm(cwd, { recursive: true, force: true });
	});

	test("scaffolds the full file tree into the target directory", () => {
		const { status, stdout } = runBin(cwd, "my-blog");
		expect(status).toBe(0);

		const root = join(cwd, "my-blog");
		for (const file of [
			"package.json",
			"index.js",
			"build.js",
			"dev.js",
			"layout.js",
			".gitignore",
			"content/index.md",
			"content/about.md",
			"content/blog/hello-world.md",
		]) {
			expect(existsSync(join(root, file)), `${file} should exist`).toBe(true);
		}

		expect(stdout).toContain("cd my-blog");
		expect(stdout).toContain("npm install");
		expect(stdout).toContain("node index.js");
	});

	test("rewrites the package.json name to the target directory basename", async () => {
		expect(runBin(cwd, "my-blog").status).toBe(0);

		const pkg = JSON.parse(await readFile(join(cwd, "my-blog", "package.json"), "utf8"));
		expect(pkg.name).toBe("my-blog");
		expect(pkg.type).toBe("module");
		expect(pkg.dependencies["@sphido/core"]).toBe("^3");
	});

	test("renames the dotless gitignore to .gitignore", async () => {
		expect(runBin(cwd, "my-blog").status).toBe(0);

		const root = join(cwd, "my-blog");
		expect(existsSync(join(root, "gitignore"))).toBe(false);
		const gitignore = await readFile(join(root, ".gitignore"), "utf8");
		expect(gitignore).toContain("node_modules");
		expect(gitignore).toContain("public");
	});

	test("defaults to my-site when no directory is given", () => {
		expect(runBin(cwd).status).toBe(0);
		expect(existsSync(join(cwd, "my-site", "index.js"))).toBe(true);
	});

	test("scaffolds into an existing empty directory", () => {
		expect(runBin(cwd, ".").status).toBe(0);
		expect(existsSync(join(cwd, "index.js"))).toBe(true);
	});

	test("refuses a non-empty target directory with exit code 1", async () => {
		await mkdir(join(cwd, "taken"));
		await writeFile(join(cwd, "taken", "keep.txt"), "do not overwrite");

		const { status, stderr } = runBin(cwd, "taken");
		expect(status).toBe(1);
		expect(stderr).toContain("not empty");
		expect(existsSync(join(cwd, "taken", "index.js"))).toBe(false);
	});
});

describe("template smoke checks", () => {
	test.each(["index.js", "build.js", "dev.js", "layout.js"])("template/%s parses (node --check)", (file) => {
		const { status, stderr } = spawnSync(process.execPath, ["--check", join(template, file)], { encoding: "utf8" });
		expect(stderr).toBe("");
		expect(status).toBe(0);
	});

	test("template package.json is valid JSON with the expected scripts", async () => {
		const pkg = JSON.parse(await readFile(join(template, "package.json"), "utf8"));
		expect(pkg.type).toBe("module");
		expect(pkg.scripts.build).toBe("node index.js");
	});

	test("template renders markdown through @sphido/markdown", async () => {
		const pkg = JSON.parse(await readFile(join(template, "package.json"), "utf8"));
		expect(pkg.dependencies["@sphido/markdown"]).toBe("^1");

		const build = await readFile(join(template, "build.js"), "utf8");
		expect(build).toContain("markdown()");
	});
});
