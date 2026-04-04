import type { Dirent } from "node:fs";
import { describe, expect, test } from "vitest";
import { isPage } from "./is-page.js";

function fakeDirent(name: string, type: "file" | "directory"): Dirent {
	return {
		name,
		isFile: () => type === "file",
		isDirectory: () => type === "directory",
	} as Dirent;
}

describe("isPage", () => {
	test("accepts .md files", () => {
		expect(isPage(fakeDirent("page.md", "file"))).toBe(true);
	});

	test("accepts .html files", () => {
		expect(isPage(fakeDirent("index.html", "file"))).toBe(true);
	});

	test("rejects other file types", () => {
		expect(isPage(fakeDirent("image.png", "file"))).toBe(false);
		expect(isPage(fakeDirent("style.css", "file"))).toBe(false);
		expect(isPage(fakeDirent("favicon.ico", "file"))).toBe(false);
	});

	test("rejects files starting with underscore (drafts)", () => {
		expect(isPage(fakeDirent("_draft.md", "file"))).toBe(false);
	});

	test("rejects hidden files", () => {
		expect(isPage(fakeDirent(".hidden.md", "file"))).toBe(false);
	});

	test("accepts directories", () => {
		expect(isPage(fakeDirent("sub", "directory"))).toBe(true);
	});

	test("rejects hidden directories", () => {
		expect(isPage(fakeDirent(".git", "directory"))).toBe(false);
	});
});
