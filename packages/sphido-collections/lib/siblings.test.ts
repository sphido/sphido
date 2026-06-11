import type { Page, Pages } from "@sphido/core";
import { describe, expect, test } from "vitest";
import { siblings } from "./siblings.js";

function page(name: string): Page {
	return { name, path: `/content/${name}.md` };
}

describe("siblings", () => {
	const first = page("first");
	const middle = page("middle");
	const last = page("last");
	const pages: Pages = [first, middle, last];

	test("returns prev and next for a page in the middle", () => {
		expect(siblings(pages, middle)).toEqual({ prev: first, next: last });
	});

	test("first page has no prev", () => {
		expect(siblings(pages, first)).toEqual({ prev: null, next: middle });
	});

	test("last page has no next", () => {
		expect(siblings(pages, last)).toEqual({ prev: middle, next: null });
	});

	test("page not found returns both null", () => {
		expect(siblings(pages, page("stranger"))).toEqual({ prev: null, next: null });
	});

	test("matches by identity, not by equality", () => {
		const copy = { ...middle };
		expect(siblings(pages, copy)).toEqual({ prev: null, next: null });
	});

	test("single page has no siblings", () => {
		expect(siblings([first], first)).toEqual({ prev: null, next: null });
	});

	test("empty array returns both null", () => {
		expect(siblings([], first)).toEqual({ prev: null, next: null });
	});

	test("does not mutate the input array", () => {
		const input = [first, middle, last];
		siblings(input, middle);
		expect(input).toEqual([first, middle, last]);
	});

	test("returned siblings reference the original page objects", () => {
		const result = siblings(pages, middle);
		expect(result.prev).toBe(first);
		expect(result.next).toBe(last);
	});
});
