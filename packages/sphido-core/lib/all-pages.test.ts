import { describe, expect, test } from "vitest";
import { allPages } from "./all-pages.js";
import type { Pages } from "./index.js";

describe("allPages", () => {
	test("flattens nested pages", () => {
		const pages: Pages = [
			{ name: "a", path: "/a" },
			{
				name: "sub",
				path: "/sub",
				children: [
					{ name: "b", path: "/sub/b" },
					{ name: "c", path: "/sub/c" },
				],
			},
		];
		const flat = [...allPages(pages)];
		expect(flat.map((p) => p.name)).toEqual(["a", "b", "c"]);
	});

	test("yields nothing for empty array", () => {
		expect([...allPages([])]).toEqual([]);
	});

	test("handles deeply nested pages", () => {
		const pages: Pages = [
			{
				name: "l1",
				path: "/l1",
				children: [
					{
						name: "l2",
						path: "/l1/l2",
						children: [{ name: "l3", path: "/l1/l2/l3" }],
					},
				],
			},
		];
		const flat = [...allPages(pages)];
		expect(flat.map((p) => p.name)).toEqual(["l3"]);
	});
});
