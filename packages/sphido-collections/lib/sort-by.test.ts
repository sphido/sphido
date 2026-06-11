import type { Page, Pages } from "@sphido/core";
import { describe, expect, test } from "vitest";
import { sortBy } from "./sort-by.js";

function page(name: string, extra: Record<string, unknown> = {}): Page {
	return { name, path: `/content/${name}.md`, ...extra };
}

describe("sortBy", () => {
	test("sorts by string selector ascending", () => {
		const pages: Pages = [page("banana"), page("apple"), page("cherry")];
		const sorted = sortBy(pages, (p) => p.name);
		expect(sorted.map((p) => p.name)).toEqual(["apple", "banana", "cherry"]);
	});

	test("sorts by string selector descending", () => {
		const pages: Pages = [page("banana"), page("apple"), page("cherry")];
		const sorted = sortBy(pages, (p) => p.name, "desc");
		expect(sorted.map((p) => p.name)).toEqual(["cherry", "banana", "apple"]);
	});

	test("sorts by number selector", () => {
		const pages: Pages = [page("a", { order: 3 }), page("b", { order: 1 }), page("c", { order: 2 })];
		const sorted = sortBy(pages, (p) => p.order);
		expect(sorted.map((p) => p.name)).toEqual(["b", "c", "a"]);
	});

	test("sorts by Date selector", () => {
		const pages: Pages = [
			page("middle", { date: new Date("2026-02-01") }),
			page("newest", { date: new Date("2026-03-01") }),
			page("oldest", { date: new Date("2026-01-01") }),
		];
		const sorted = sortBy(pages, (p) => p.date, "desc");
		expect(sorted.map((p) => p.name)).toEqual(["newest", "middle", "oldest"]);
	});

	test("undefined values go last in ascending order", () => {
		const pages: Pages = [page("no-date"), page("b", { order: 2 }), page("a", { order: 1 })];
		const sorted = sortBy(pages, (p) => p.order);
		expect(sorted.map((p) => p.name)).toEqual(["a", "b", "no-date"]);
	});

	test("undefined values go last in descending order too", () => {
		const pages: Pages = [page("no-date"), page("a", { order: 1 }), page("b", { order: 2 })];
		const sorted = sortBy(pages, (p) => p.order, "desc");
		expect(sorted.map((p) => p.name)).toEqual(["b", "a", "no-date"]);
	});

	test("sort is stable for equal values", () => {
		const pages: Pages = [
			page("first", { order: 1 }),
			page("second", { order: 1 }),
			page("third", { order: 0 }),
			page("fourth", { order: 1 }),
		];
		const sorted = sortBy(pages, (p) => p.order);
		expect(sorted.map((p) => p.name)).toEqual(["third", "first", "second", "fourth"]);
	});

	test("keeps original order of multiple pages without a value", () => {
		const pages: Pages = [page("x"), page("a", { order: 1 }), page("y"), page("z")];
		const sorted = sortBy(pages, (p) => p.order);
		expect(sorted.map((p) => p.name)).toEqual(["a", "x", "y", "z"]);
	});

	test("returns a new array and does not mutate the input", () => {
		const pages: Pages = [page("b"), page("a")];
		const snapshot = [...pages];
		const sorted = sortBy(pages, (p) => p.name);
		expect(sorted).not.toBe(pages);
		expect(pages).toEqual(snapshot);
		expect(pages[0]?.name).toBe("b");
	});

	test("returned pages are the same objects (no copies)", () => {
		const pages: Pages = [page("b"), page("a")];
		const sorted = sortBy(pages, (p) => p.name);
		expect(sorted[0]).toBe(pages[1]);
		expect(sorted[1]).toBe(pages[0]);
	});

	test("handles empty input", () => {
		expect(sortBy([], (p) => p.name)).toEqual([]);
	});
});
