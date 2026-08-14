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

describe("frontmatter — dates", () => {
	test("a plain date becomes a Date", async () => {
		const p = page("---\ndate: 2018-09-11\n---\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.date).toBeInstanceOf(Date);
		expect((p.date as Date).toISOString()).toBe("2018-09-11T00:00:00.000Z");
	});

	test("a timestamp with time and zone becomes a Date", async () => {
		const p = page("---\ndate: 2018-09-11T10:20:30Z\nupdated: 2024-05-07 07:30:56 +2\n---\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.date).toBeInstanceOf(Date);
		expect((p.date as Date).toISOString()).toBe("2018-09-11T10:20:30.000Z");
		expect(p.updated).toBeInstanceOf(Date);
		expect((p.updated as Date).toISOString()).toBe("2024-05-07T05:30:56.000Z");
	});

	test("a quoted date stays a string", async () => {
		const p = page('---\ndate: "2018-09-11"\n---\n\ncontent');
		await frontmatter(p, fileDirent());
		expect(p.date).toBe("2018-09-11");
	});

	test("adding timestamps keeps the rest of the core schema intact", async () => {
		const p = page("---\nshorthand: y\nzeroes: 0755\nversion: 1.10\nnothing: null\n---\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.shorthand).toBe("y"); // YAML 1.1 would make this true
		expect(p.zeroes).toBe(755); // and this an octal 493
		expect(p.version).toBe(1.1);
		expect(p.nothing).toBeNull();
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

	test("leaves plain HTML comments in place", async () => {
		const p = page("<!-- just a plain comment -->\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.content).toBe("<!-- just a plain comment -->\n\ncontent");
		expect(p.fmParseError).toBeUndefined();
	});

	test("leaves HTML comments with invalid YAML in place", async () => {
		const p = page("<!-- title: [ -->\n\ncontent");
		await frontmatter(p, fileDirent());
		expect(p.content).toBe("<!-- title: [ -->\n\ncontent");
		expect(p.fmParseError).toBeUndefined();
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
