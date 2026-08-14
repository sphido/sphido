import { mkdir, mkdtemp, readFile, rm, stat, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Page } from "@sphido/core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { type CacheOptions, changed, removed, resetCache, writeCache } from "./cache.js";

let dir: string;
let options: CacheOptions;

beforeEach(async () => {
	dir = await mkdtemp(join(tmpdir(), "sphido-cache-"));
	options = { file: join(dir, ".sphido/cache.json") };
});

afterEach(async () => {
	resetCache(options);
	await rm(dir, { recursive: true, force: true });
});

async function source(name: string, content = "# page\n"): Promise<Page> {
	const path = join(dir, name);
	await writeFile(path, content);
	return { name, path } as Page;
}

/** A rebuild in a fresh process: drop the in-memory state, keep the file */
function rebuild(): void {
	resetCache(options);
}

describe("changed", () => {
	test("everything is changed on the first run", async () => {
		const one = await source("one.md");
		const two = await source("two.md");

		expect(await changed(one, options)).toBe(true);
		expect(await changed(two, options)).toBe(true);
	});

	test("nothing is changed on a no-op rebuild", async () => {
		const page = await source("one.md");
		await changed(page, options);
		await writeCache(options);

		rebuild();
		expect(await changed(page, options)).toBe(false);
	});

	test("only the touched page is changed", async () => {
		const one = await source("one.md");
		const two = await source("two.md");
		await changed(one, options);
		await changed(two, options);
		await writeCache(options);

		rebuild();
		await writeFile(one.path, "# edited\n");
		expect(await changed(one, options)).toBe(true);
		expect(await changed(two, options)).toBe(false);
	});

	test("a bumped version invalidates every page", async () => {
		const page = await source("one.md");
		await changed(page, { ...options, version: "layout-1" });
		await writeCache({ ...options, version: "layout-1" });

		rebuild();
		expect(await changed(page, { ...options, version: "layout-2" })).toBe(true);
	});

	test("a missing cache file leaves everything changed", async () => {
		const page = await source("one.md");
		expect(await changed(page, options)).toBe(true);
	});

	test("a corrupt cache file leaves everything changed, without throwing", async () => {
		const page = await source("one.md");
		await changed(page, options);
		await writeCache(options);
		await writeFile(options.file as string, "{ not json");

		rebuild();
		expect(await changed(page, options)).toBe(true);
	});

	test("a page without a path is always changed", async () => {
		expect(await changed({ name: "virtual" } as Page, options)).toBe(true);
	});

	test("an unreadable source is changed", async () => {
		const page = { name: "gone", path: join(dir, "gone.md") } as Page;
		expect(await changed(page, options)).toBe(true);
	});

	test("a missing output makes an unchanged source changed again", async () => {
		const page = await source("one.md");
		page.output = join(dir, "public/one.html");

		await changed(page, options);
		await mkdir(join(dir, "public"), { recursive: true });
		await writeFile(page.output, "<h1>page</h1>");
		await writeCache(options);

		rebuild();
		expect(await changed(page, options)).toBe(false);

		await rm(page.output);
		rebuild();
		expect(await changed(page, options)).toBe(true);
	});
});

describe("changed — strategies", () => {
	test("mtime notices a touch that leaves the content alone", async () => {
		const page = await source("one.md");
		const mtime = { ...options, strategy: "mtime" as const };
		await changed(page, mtime);
		await writeCache(mtime);

		rebuild();
		const when = new Date(Date.now() + 60_000);
		await utimes(page.path, when, when);
		expect(await changed(page, mtime)).toBe(true);
	});

	test("hash ignores a touch and only reacts to content", async () => {
		const page = await source("one.md");
		const hash = { ...options, strategy: "hash" as const };
		await changed(page, hash);
		await writeCache(hash);

		rebuild();
		const when = new Date(Date.now() + 60_000);
		await utimes(page.path, when, when);
		expect(await changed(page, hash)).toBe(false);

		rebuild();
		await writeFile(page.path, "# edited\n");
		expect(await changed(page, hash)).toBe(true);
	});

	test("switching strategy invalidates the state", async () => {
		const page = await source("one.md");
		await changed(page, { ...options, strategy: "mtime" });
		await writeCache({ ...options, strategy: "mtime" });

		rebuild();
		expect(await changed(page, { ...options, strategy: "hash" })).toBe(true);
	});
});

describe("writeCache", () => {
	test("writes the pages this build looked at", async () => {
		const one = await source("one.md");
		await source("two.md");
		await changed(one, options);
		await writeCache(options);

		const saved = JSON.parse(await readFile(options.file as string, "utf8"));
		expect(Object.keys(saved.pages)).toEqual([one.path]);
		expect(saved.strategy).toBe("mtime");
	});

	test("creates the directory and leaves no temporary file behind", async () => {
		const page = await source("one.md");
		await changed(page, options);
		await writeCache(options);

		expect((await stat(options.file as string)).isFile()).toBe(true);
		await expect(stat(`${options.file}.${process.pid}.tmp`)).rejects.toThrow();
	});

	test("a second rebuild in the same process sees the state it just wrote", async () => {
		const page = await source("one.md");
		expect(await changed(page, options)).toBe(true);
		await writeCache(options);

		// no rebuild() here — this is the dev server case, one long-lived process
		expect(await changed(page, options)).toBe(false);
		await writeCache(options);
		expect(await changed(page, options)).toBe(false);
	});
});

describe("removed", () => {
	test("lists pages the previous build had and this one does not", async () => {
		const one = await source("one.md");
		const two = await source("two.md");
		await changed(one, options);
		await changed(two, options);
		await writeCache(options);

		rebuild();
		await rm(two.path);
		await changed(one, options);

		expect(removed(options)).toEqual([two.path]);
	});

	test("is empty when the page set is unchanged", async () => {
		const page = await source("one.md");
		await changed(page, options);
		await writeCache(options);

		rebuild();
		await changed(page, options);
		expect(removed(options)).toEqual([]);
	});
});
