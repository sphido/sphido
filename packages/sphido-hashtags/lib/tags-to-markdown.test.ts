import { describe, expect, test } from "vitest";
import { tagsToMarkdown } from "./tags-to-markdown.js";

describe("tagsToMarkdown", () => {
	test("empty or null tag array returns content unchanged", () => {
		expect(tagsToMarkdown("some #content", [])).toBe("some #content");
		expect(tagsToMarkdown("some #content", null)).toBe("some #content");
	});

	test("single tag converted to markdown link", () => {
		expect(tagsToMarkdown("some #content content", ["#content"])).toBe("some [#content](/tag/content) content");
	});

	test("multiple tags converted", () => {
		expect(tagsToMarkdown("some #a #a #b", ["#a", "#b"])).toBe("some [#a](/tag/a) [#a](/tag/a) [#b](/tag/b)");
	});

	test("tag that is a prefix of another tag does not split it", () => {
		expect(tagsToMarkdown("#go #golang", ["#go", "#golang"])).toBe("[#go](/tag/go) [#golang](/tag/golang)");
	});

	test("keeps inline code untouched", () => {
		expect(tagsToMarkdown("use `#tag` and #tag", ["#tag"])).toBe("use `#tag` and [#tag](/tag/tag)");
	});

	test("keeps fenced code blocks untouched", () => {
		expect(tagsToMarkdown("```\n#tag\n```\n#tag", ["#tag"])).toBe("```\n#tag\n```\n[#tag](/tag/tag)");
	});

	test("custom urlBase", () => {
		expect(tagsToMarkdown("#a", ["#a"], { urlBase: "/new-base/" })).toBe("[#a](/new-base/a)");
	});

	test("custom tagToUrl function", () => {
		expect(tagsToMarkdown("#a", ["#a"], { tagToUrl: (tag) => tag })).toBe("[#a](/tag/#a)");
	});
});
