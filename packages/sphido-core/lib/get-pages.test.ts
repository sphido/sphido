import { describe, expect, test } from "vitest";
import { getPages } from "./get-pages.js";
import type { Page } from "./index.js";

const contentPath = new URL("../examples/content", import.meta.url).pathname;

describe("getPages", () => {
	test("returns pages from directory", async () => {
		const pages = await getPages({ path: contentPath });
		const names = pages.map((p) => p.name);
		expect(names).toContain("one");
		expect(names).toContain("two");
		expect(names).toContain("index");
	});

	test("includes subdirectories with children", async () => {
		const pages = await getPages({ path: contentPath });
		const sub = pages.find((p) => p.name === "sub");
		expect(sub).toBeDefined();
		expect(sub?.children).toBeDefined();
		expect(sub?.children?.length).toBeGreaterThan(0);
	});

	test("skips hidden and draft files", async () => {
		const pages = await getPages({ path: contentPath });
		const names = pages.map((p) => p.name);
		expect(names).not.toContain("favicon");
	});

	test("applies callback extender", async () => {
		const pages = await getPages({ path: contentPath }, async (page: Page) => {
			page.custom = "extended";
		});
		for (const page of pages) {
			expect(page.custom).toBe("extended");
		}
	});

	test("applies object extender", async () => {
		const pages = await getPages({ path: contentPath }, { extra: true } as any);
		for (const page of pages) {
			expect(page.extra).toBe(true);
		}
	});
});
