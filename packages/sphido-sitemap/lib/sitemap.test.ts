import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { createSitemap } from "./sitemap.js";

const tmp = join(tmpdir(), "sphido-sitemap-test");

afterEach(async () => {
	await rm(tmp, { recursive: true, force: true });
});

describe("createSitemap", () => {
	test("creates sitemap file with XML header", async () => {
		const file = join(tmp, "sitemap.xml");
		const map = await createSitemap(file);
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(content).toContain('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(content).toContain("</urlset>");
	});

	test("adds URL entry with all parameters", async () => {
		const file = join(tmp, "sitemap.xml");
		const map = await createSitemap(file);
		map.add({
			url: "https://example.com/page",
			date: new Date("2024-01-15T00:00:00.000Z"),
			priority: 0.8,
			changefreq: "daily",
		});
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).toContain("<loc>https://example.com/page</loc>");
		expect(content).toContain("<lastmod>2024-01-15T00:00:00.000Z</lastmod>");
		expect(content).toContain("<priority>0.8</priority>");
		expect(content).toContain("<changefreq>daily</changefreq>");
	});

	test("uses default values for optional parameters", async () => {
		const file = join(tmp, "sitemap.xml");
		const map = await createSitemap(file);
		map.add({ url: "https://example.com" });
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).toContain("<loc>https://example.com</loc>");
		expect(content).toContain("<priority>0.5</priority>");
		expect(content).toContain("<changefreq>monthly</changefreq>");
		expect(content).toContain("<lastmod>");
	});

	test("escapes XML special characters in URL", async () => {
		const file = join(tmp, "sitemap.xml");
		const map = await createSitemap(file);
		map.add({ url: "https://example.com/?a=1&b=2" });
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).toContain("<loc>https://example.com/?a=1&amp;b=2</loc>");
	});

	test("adds multiple URL entries", async () => {
		const file = join(tmp, "sitemap.xml");
		const map = await createSitemap(file);
		map.add({ url: "https://example.com/one" });
		map.add({ url: "https://example.com/two" });
		map.add({ url: "https://example.com/three" });
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).toContain("<loc>https://example.com/one</loc>");
		expect(content).toContain("<loc>https://example.com/two</loc>");
		expect(content).toContain("<loc>https://example.com/three</loc>");
	});

	test("creates nested directories if needed", async () => {
		const file = join(tmp, "deep", "nested", "sitemap.xml");
		const map = await createSitemap(file);
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).toContain("</urlset>");
	});

	test("overwrites existing file", async () => {
		const file = join(tmp, "sitemap.xml");

		const map1 = await createSitemap(file);
		map1.add({ url: "https://example.com/old" });
		await map1.end();

		const map2 = await createSitemap(file);
		map2.add({ url: "https://example.com/new" });
		await map2.end();

		const content = await readFile(file, "utf-8");
		expect(content).not.toContain("https://example.com/old");
		expect(content).toContain("<loc>https://example.com/new</loc>");
	});

	test("uses LF line endings", async () => {
		const file = join(tmp, "sitemap.xml");
		const map = await createSitemap(file);
		map.add({ url: "https://example.com" });
		await map.end();

		const content = await readFile(file, "utf-8");
		expect(content).not.toContain("\r\n");
	});
});
