import type { Dirent } from "node:fs";
import type { Page } from "@sphido/core";
import { describe, expect, test } from "vitest";
import { frontmatter } from "./frontmatter.js";

function fileDirent(): Dirent {
	return { isFile: () => true } as Dirent;
}

function dirDirent(): Dirent {
	return { isFile: () => false, isDirectory: () => true } as Dirent;
}

function page(content: string): Page {
	return { name: "test", path: "/test.md", content } as Page;
}

describe("frontmatter — YAML delimiters (---)", () => {
	test("parses title, slug, and tags", async () => {
		const p = page("---\ntitle: example title\nslug: homepage\ntags: [a, b, c]\n---\n\ncontent content content");
		await frontmatter(p, fileDirent());
		expect(p.title).toBe("example title");
		expect(p.slug).toBe("homepage");
		expect(p.tags).toEqual(["a", "b", "c"]);
		expect(p.content).toBe("content content content");
	});

	test("handles Windows line endings (\\r\\n)", async () => {
		const p = page("---\r\ntitle: win\r\n---\r\n\r\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.title).toBe("win");
		expect(p.content).toBe("content");
	});
});

describe("frontmatter — HTML comment delimiters (<!-- -->)", () => {
	test("parses metadata from HTML comments", async () => {
		const p = page("<!--\ntitle: html title\ntags: [x, y]\n-->\n\nhtml content");
		await frontmatter(p, fileDirent());
		expect(p.title).toBe("html title");
		expect(p.tags).toEqual(["x", "y"]);
		expect(p.content).toBe("html content");
	});
});

describe("frontmatter — edge cases", () => {
	test("skips directories", async () => {
		const p = page("---\ntitle: should not parse\n---\n\ncontent");
		await frontmatter(p, dirDirent());
		expect(p.title).toBeUndefined();
	});

	test("leaves content unchanged when no frontmatter", async () => {
		const p = page("# Just a heading\n\nSome text");
		await frontmatter(p, fileDirent());
		expect(p.content).toBe("# Just a heading\n\nSome text");
		expect(p.title).toBeUndefined();
	});

	test("handles page without content or path", async () => {
		const p = { name: "empty" } as Page;
		await frontmatter(p, fileDirent());
		expect(p.content).toBeUndefined();
	});

	test("removes BOM before parsing", async () => {
		const p = page("\uFEFF---\ntitle: bom test\n---\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.title).toBe("bom test");
		expect(p.content).toBe("content");
	});

	test("stores fmParseError on malformed YAML", async () => {
		const p = page("---\ntitle: [\n---\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.fmParseError).toBeDefined();
		expect(p.content).toBe("content");
	});

	test("handles frontmatter with empty YAML block", async () => {
		const p = page("---\n\n---\n\ncontent only");
		await frontmatter(p, fileDirent());
		expect(p.content).toBe("content only");
	});
});
