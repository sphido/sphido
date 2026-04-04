import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, test } from "vitest";
import { copyFile } from "./copy-file.js";
import { readFile } from "./read-file.js";
import { writeFile } from "./write-file.js";

const tmp = join(tmpdir(), `sphido-test-${Date.now()}`);

afterAll(async () => {
	await rm(tmp, { recursive: true, force: true });
});

describe("readFile", () => {
	test("reads file content as string", async () => {
		const content = await readFile(new URL("../examples/content/one.md", import.meta.url).pathname);
		expect(content).toContain("# This is dummy page one");
	});
});

describe("writeFile", () => {
	test("writes file and creates directories", async () => {
		const file = join(tmp, "deep/dir/test.txt");
		await writeFile(file, "hello");
		const content = await readFile(file);
		expect(content).toBe("hello");
	});
});

describe("copyFile", () => {
	test("copies file and creates directories", async () => {
		const src = new URL("../examples/content/one.md", import.meta.url).pathname;
		const dest = join(tmp, "copy/one.md");
		await copyFile(src, dest);
		expect(existsSync(dest)).toBe(true);
		const content = await readFile(dest);
		expect(content).toContain("# This is dummy page one");
	});
});
