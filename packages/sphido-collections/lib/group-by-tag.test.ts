import type { Page, Pages } from "@sphido/core";
import { describe, expect, test } from "vitest";
import { groupByTag } from "./group-by-tag.js";

function page(name: string, extra: Record<string, unknown> = {}): Page {
	return { name, path: `/content/${name}.md`, ...extra };
}

describe("groupByTag", () => {
	test("groups pages with Set values (as produced by @sphido/hashtags)", () => {
		const pages: Pages = [
			page("a", { tags: new Set(["js", "web"]) }),
			page("b", { tags: new Set(["js"]) }),
			page("c", { tags: new Set(["css"]) }),
		];
		const groups = groupByTag(pages);
		expect(groups.get("js")?.map((p) => p.name)).toEqual(["a", "b"]);
		expect(groups.get("web")?.map((p) => p.name)).toEqual(["a"]);
		expect(groups.get("css")?.map((p) => p.name)).toEqual(["c"]);
	});

	test("groups pages with array values (frontmatter)", () => {
		const pages: Pages = [page("a", { tags: ["news", "blog"] }), page("b", { tags: ["blog"] })];
		const groups = groupByTag(pages);
		expect(groups.get("blog")?.map((p) => p.name)).toEqual(["a", "b"]);
		expect(groups.get("news")?.map((p) => p.name)).toEqual(["a"]);
	});

	test("skips pages with a missing key", () => {
		const pages: Pages = [page("a", { tags: ["blog"] }), page("no-tags")];
		const groups = groupByTag(pages);
		expect(groups.size).toBe(1);
		expect(groups.get("blog")?.map((p) => p.name)).toEqual(["a"]);
	});

	test("keys are sorted by tag name", () => {
		const pages: Pages = [page("a", { tags: ["zebra", "apple", "mango"] })];
		const groups = groupByTag(pages);
		expect([...groups.keys()]).toEqual(["apple", "mango", "zebra"]);
	});

	test("supports a custom key", () => {
		const pages: Pages = [page("a", { categories: ["howto"] })];
		const groups = groupByTag(pages, "categories");
		expect(groups.get("howto")?.map((p) => p.name)).toEqual(["a"]);
	});

	test("duplicate tags in an array list the page only once", () => {
		const pages: Pages = [page("a", { tags: ["blog", "blog"] })];
		const groups = groupByTag(pages);
		expect(groups.get("blog")).toHaveLength(1);
	});

	test("empty input returns an empty Map", () => {
		const groups = groupByTag([]);
		expect(groups.size).toBe(0);
	});

	test("does not mutate input pages or their tags", () => {
		const tags = new Set(["js", "web"]);
		const pages: Pages = [page("a", { tags })];
		groupByTag(pages);
		expect(pages[0]?.tags).toBe(tags);
		expect([...tags]).toEqual(["js", "web"]);
		expect(pages).toHaveLength(1);
	});

	test("grouped pages reference the original page objects", () => {
		const pages: Pages = [page("a", { tags: ["blog"] })];
		const groups = groupByTag(pages);
		expect(groups.get("blog")?.[0]).toBe(pages[0]);
	});
});
