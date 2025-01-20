import { describe, expect, it } from "vitest";
import { tagsToMarkdown } from "../lib/tags-to-markdown.ts";

describe("tagsToMarkdown", () => {
	it("empty tag array shouldn't convert anything", () => {
		expect(tagsToMarkdown("some #content", [])).toBe("some #content");
		expect(tagsToMarkdown("some #content", null)).toBe("some #content");
	});

	it("single tag should be converted", () => {
		expect(tagsToMarkdown("some #content content", ["#content"])).toBe("some [#content](/tag/content) content");
	});

	it("multiple tags should be converted", () => {
		expect(tagsToMarkdown("some #a #a #b", ["#a", "#b"])).toBe("some [#a](/tag/a) [#a](/tag/a) [#b](/tag/b)");
	});

	it("change tag urlBase", () => {
		expect(tagsToMarkdown("#a", ["#a"], { urlBase: "/new-base/" })).toBe("[#a](/new-base/a)");
	});

	it("change tagToUrl function", () => {
		expect(tagsToMarkdown("#a", ["#a"], { tagToUrl: (tag) => tag })).toBe("[#a](/tag/#a)");
	});
});
