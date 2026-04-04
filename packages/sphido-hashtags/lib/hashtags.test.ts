import type { Dirent } from "node:fs";
import type { Page } from "@sphido/core";
import { describe, expect, test } from "vitest";
import { hashtags } from "./hashtags.js";

function fileDirent(): Dirent {
	return { isFile: () => true } as Dirent;
}

function dirDirent(): Dirent {
	return { isFile: () => false, isDirectory: () => true } as Dirent;
}

function page(content: string): Page {
	return { name: "test", path: "/test.md", content } as Page;
}

describe("hashtags", () => {
	test("single tag detected and converted", async () => {
		const p = page("only #one hashtag");
		await hashtags(p, fileDirent());
		expect(p.tags.has("one")).toBe(true);
		expect(p.content).toBe("only [#one](/tag/one) hashtag");
	});

	test("multiple tags detected", async () => {
		const p = page("#one #two #three");
		await hashtags(p, fileDirent());
		expect(p.tags.has("one")).toBe(true);
		expect(p.tags.has("two")).toBe(true);
		expect(p.tags.has("three")).toBe(true);
		expect(p.content).toBe("[#one](/tag/one) [#two](/tag/two) [#three](/tag/three)");
	});

	test("skips inline code", async () => {
		const p = page("inside `#code` or ` #code ` with something $#35;");
		await hashtags(p, fileDirent());
		expect(p.tags.has("code")).toBe(false);
		expect(p.tags.has("35")).toBe(false);
	});

	test("skips preformatted code blocks", async () => {
		const p = page("CSS code\n\n```css\n * { color: #fefefe; }\n```\n\n and contains one #hashtag at the end\n");
		await hashtags(p, fileDirent());
		expect(p.tags.has("hashtag")).toBe(true);
		expect(p.tags.has("fefefe")).toBe(false);
	});

	test("skips markdown anchor links", async () => {
		const p = page("[link to index](#index)");
		await hashtags(p, fileDirent());
		expect(p.tags.has("index")).toBe(false);
	});

	test("allows underscore and hyphen in tags", async () => {
		const p = page(" #example_one #example-two #some~special");
		await hashtags(p, fileDirent());
		expect(p.tags.has("example_one")).toBe(true);
		expect(p.tags.has("example-two")).toBe(true);
		expect(p.tags.has("some")).toBe(true);
	});

	test("connected tags — only first matched", async () => {
		const p = page(" #code#not#something");
		await hashtags(p, fileDirent());
		expect(p.tags.has("code")).toBe(true);
		expect(p.tags.has("not")).toBe(false);
		expect(p.tags.has("something")).toBe(false);
	});

	test("skips directories", async () => {
		const p = page("#tag in directory");
		await hashtags(p, dirDirent());
		expect(p.tags).toBeUndefined();
	});

	test("handles content without hashtags", async () => {
		const p = page("no tags here");
		await hashtags(p, fileDirent());
		expect(p.tags.size).toBe(0);
	});
});
