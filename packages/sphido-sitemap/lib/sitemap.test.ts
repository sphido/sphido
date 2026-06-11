import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Pages } from "@sphido/core";
import { afterEach, describe, expect, test } from "vitest";
import { pagesToSitemap, renderSitemap, writeSitemap } from "./sitemap.js";

describe("renderSitemap", () => {
	test("renders a valid empty urlset", () => {
		const xml = renderSitemap([]);
		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain("</urlset>");
		expect(xml).not.toContain("<url>");
	});

	test("renders entry with all fields", () => {
		const xml = renderSitemap([
			{
				url: "https://example.com/page",
				lastmod: new Date("2024-01-15T00:00:00.000Z"),
				priority: 0.8,
				changefreq: "daily",
			},
		]);
		expect(xml).toContain("<loc>https://example.com/page</loc>");
		expect(xml).toContain("<lastmod>2024-01-15T00:00:00.000Z</lastmod>");
		expect(xml).toContain("<priority>0.8</priority>");
		expect(xml).toContain("<changefreq>daily</changefreq>");
	});

	test("renders only loc when optional fields are missing", () => {
		const xml = renderSitemap([{ url: "https://example.com" }]);
		expect(xml).toContain("<loc>https://example.com</loc>");
		expect(xml).not.toContain("<lastmod>");
		expect(xml).not.toContain("<priority>");
		expect(xml).not.toContain("<changefreq>");
	});

	test("escapes all five XML special characters", () => {
		const xml = renderSitemap([{ url: `https://example.com/?q=<>&"'` }]);
		expect(xml).toContain("<loc>https://example.com/?q=&lt;&gt;&amp;&quot;&apos;</loc>");
	});

	test("accepts URL instances and lastmod as string", () => {
		const xml = renderSitemap([{ url: new URL("https://example.com/page"), lastmod: "2024-01-15" }]);
		expect(xml).toContain("<loc>https://example.com/page</loc>");
		expect(xml).toContain("<lastmod>2024-01-15</lastmod>");
	});

	test("clamps priority to the 0-1 range", () => {
		const xml = renderSitemap([
			{ url: "https://example.com/a", priority: 1.5 },
			{ url: "https://example.com/b", priority: -1 },
		]);
		expect(xml).toContain("<priority>1</priority>");
		expect(xml).toContain("<priority>0</priority>");
	});

	test("supports all protocol changefreq values", () => {
		const xml = renderSitemap([
			{ url: "https://example.com/a", changefreq: "always" },
			{ url: "https://example.com/b", changefreq: "hourly" },
			{ url: "https://example.com/c", changefreq: "never" },
		]);
		expect(xml).toContain("<changefreq>always</changefreq>");
		expect(xml).toContain("<changefreq>hourly</changefreq>");
		expect(xml).toContain("<changefreq>never</changefreq>");
	});

	test("accepts a generator as input", () => {
		function* entries() {
			yield { url: "https://example.com/one" };
			yield { url: "https://example.com/two" };
		}
		const xml = renderSitemap(entries());
		expect(xml).toContain("<loc>https://example.com/one</loc>");
		expect(xml).toContain("<loc>https://example.com/two</loc>");
	});

	test("uses LF line endings", () => {
		const xml = renderSitemap([{ url: "https://example.com" }]);
		expect(xml).not.toContain("\r\n");
	});
});

describe("pagesToSitemap", () => {
	test("flattens nested pages and resolves urls against baseUrl", () => {
		const pages: Pages = [
			{ name: "one", path: "content/one.md", slug: "one.html" },
			{
				name: "sub",
				path: "content/sub",
				children: [{ name: "three", path: "content/sub/three.md", url: "/sub/three.html" }],
			},
		];
		const xml = pagesToSitemap(pages, { baseUrl: "https://example.com" });
		expect(xml).toContain("<loc>https://example.com/one.html</loc>");
		expect(xml).toContain("<loc>https://example.com/sub/three.html</loc>");
	});

	test("falls back to page name for the url", () => {
		const pages: Pages = [{ name: "about", path: "content/about.md" }];
		const xml = pagesToSitemap(pages, { baseUrl: "https://example.com" });
		expect(xml).toContain("<loc>https://example.com/about.html</loc>");
	});

	test("applies defaults and per-page overrides", () => {
		const pages: Pages = [
			{ name: "one", path: "content/one.md" },
			{ name: "two", path: "content/two.md", priority: 1, changefreq: "daily" },
		];
		const xml = pagesToSitemap(pages, {
			baseUrl: "https://example.com",
			defaults: { priority: 0.5, changefreq: "monthly" },
		});
		expect(xml).toContain("<priority>0.5</priority>");
		expect(xml).toContain("<changefreq>monthly</changefreq>");
		expect(xml).toContain("<priority>1</priority>");
		expect(xml).toContain("<changefreq>daily</changefreq>");
	});

	test("uses page.lastmod or page.date for lastmod", () => {
		const pages: Pages = [
			{ name: "a", path: "a.md", lastmod: new Date("2024-01-15T00:00:00.000Z") },
			{ name: "b", path: "b.md", date: "2024-02-20" },
		];
		const xml = pagesToSitemap(pages, { baseUrl: "https://example.com" });
		expect(xml).toContain("<lastmod>2024-01-15T00:00:00.000Z</lastmod>");
		expect(xml).toContain("<lastmod>2024-02-20</lastmod>");
	});

	test("empty input produces a valid empty urlset", () => {
		const xml = pagesToSitemap([], { baseUrl: "https://example.com" });
		expect(xml).toContain("</urlset>");
		expect(xml).not.toContain("<url>");
	});
});

describe("writeSitemap", () => {
	const tmp = join(tmpdir(), "sphido-sitemap-test");

	afterEach(async () => {
		await rm(tmp, { recursive: true, force: true });
	});

	test("writes the file and creates nested directories", async () => {
		const file = join(tmp, "deep", "nested", "sitemap.xml");
		await writeSitemap(file, renderSitemap([{ url: "https://example.com" }]));

		const content = await readFile(file, "utf-8");
		expect(content).toContain("<loc>https://example.com</loc>");
		expect(content).toContain("</urlset>");
	});

	test("overwrites an existing file", async () => {
		const file = join(tmp, "sitemap.xml");
		await writeSitemap(file, renderSitemap([{ url: "https://example.com/old" }]));
		await writeSitemap(file, renderSitemap([{ url: "https://example.com/new" }]));

		const content = await readFile(file, "utf-8");
		expect(content).not.toContain("https://example.com/old");
		expect(content).toContain("<loc>https://example.com/new</loc>");
	});
});
