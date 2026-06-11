import type { Page, Pages } from "@sphido/core";
import { describe, expect, test } from "vitest";
import { paginate } from "./paginate.js";

function pages(count: number): Pages {
	return Array.from({ length: count }, (_, i): Page => ({ name: `page-${i + 1}`, path: `/content/page-${i + 1}.md` }));
}

describe("paginate", () => {
	test("splits pages into 1-based chunks with prev/next", () => {
		const result = paginate(pages(5), 2);
		expect(result).toHaveLength(3);

		expect(result[0]).toMatchObject({ page: 1, total: 3, prev: null, next: 2 });
		expect(result[1]).toMatchObject({ page: 2, total: 3, prev: 1, next: 3 });
		expect(result[2]).toMatchObject({ page: 3, total: 3, prev: 2, next: null });

		expect(result[0]?.items.map((p) => p.name)).toEqual(["page-1", "page-2"]);
		expect(result[1]?.items.map((p) => p.name)).toEqual(["page-3", "page-4"]);
		expect(result[2]?.items.map((p) => p.name)).toEqual(["page-5"]);
	});

	test("empty input returns an empty array", () => {
		expect(paginate([], 10)).toEqual([]);
	});

	test("exact multiple fills all chunks completely", () => {
		const result = paginate(pages(6), 3);
		expect(result).toHaveLength(2);
		expect(result[0]?.items).toHaveLength(3);
		expect(result[1]?.items).toHaveLength(3);
		expect(result[1]?.next).toBeNull();
	});

	test("single page when perPage >= input length", () => {
		const result = paginate(pages(3), 10);
		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({ page: 1, total: 1, prev: null, next: null });
		expect(result[0]?.items).toHaveLength(3);
	});

	test("throws RangeError when perPage < 1", () => {
		expect(() => paginate(pages(3), 0)).toThrow(RangeError);
		expect(() => paginate(pages(3), -1)).toThrow(RangeError);
	});

	test("throws RangeError when perPage is not an integer", () => {
		expect(() => paginate(pages(3), 1.5)).toThrow(RangeError);
		expect(() => paginate(pages(3), Number.NaN)).toThrow(RangeError);
	});

	test("does not mutate the input array", () => {
		const input = pages(5);
		const snapshot = [...input];
		paginate(input, 2);
		expect(input).toEqual(snapshot);
		expect(input).toHaveLength(5);
	});

	test("items reference the original page objects", () => {
		const input = pages(2);
		const result = paginate(input, 1);
		expect(result[0]?.items[0]).toBe(input[0]);
		expect(result[1]?.items[0]).toBe(input[1]);
	});
});
