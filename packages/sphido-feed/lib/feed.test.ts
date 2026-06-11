import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { type FeedChannel, type FeedItem, renderFeed, writeFeed } from "./feed.js";

const channel: FeedChannel = {
	title: "My Blog",
	link: "https://example.com",
	description: "Notes about everything",
};

describe("renderFeed", () => {
	test("renders envelope and required channel fields", () => {
		const xml = renderFeed(channel, []);
		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<rss version="2.0">');
		expect(xml).toContain("<channel>");
		expect(xml).toContain("<title>My Blog</title>");
		expect(xml).toContain("<link>https://example.com</link>");
		expect(xml).toContain("<description>Notes about everything</description>");
		expect(xml).toContain("</channel>");
		expect(xml).toContain("</rss>");
	});

	test("emits optional channel language", () => {
		const xml = renderFeed({ ...channel, language: "en" }, []);
		expect(xml).toContain("<language>en</language>");
	});

	test("renders a full item", () => {
		const xml = renderFeed(channel, [
			{
				title: "Hello world",
				url: "https://example.com/hello",
				date: new Date("2024-01-15T12:30:00.000Z"),
				description: "First post",
				author: "roman@ozana.cz (Roman)",
			},
		]);
		expect(xml).toContain("<item>");
		expect(xml).toContain("<title>Hello world</title>");
		expect(xml).toContain("<link>https://example.com/hello</link>");
		expect(xml).toContain("<description>First post</description>");
		expect(xml).toContain("<author>roman@ozana.cz (Roman)</author>");
		expect(xml).toContain("</item>");
	});

	test("formats item dates as RFC 822, not ISO", () => {
		const xml = renderFeed(channel, [
			{ title: "a", url: "https://example.com/a", date: new Date("2024-01-15T12:30:00.000Z") },
		]);
		expect(xml).toContain("<pubDate>Mon, 15 Jan 2024 12:30:00 GMT</pubDate>");
		expect(xml).not.toContain("2024-01-15T12:30:00");
	});

	test("emits guid as a permalink equal to the item url", () => {
		const xml = renderFeed(channel, [
			{ title: "a", url: new URL("https://example.com/a"), date: new Date("2024-01-15T00:00:00.000Z") },
		]);
		expect(xml).toContain('<guid isPermaLink="true">https://example.com/a</guid>');
	});

	test("emits atom self-link and namespace when feedUrl is provided", () => {
		const xml = renderFeed({ ...channel, feedUrl: "https://example.com/feed.xml" }, []);
		expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
		expect(xml).toContain('<atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml"/>');
	});

	test("omits atom self-link and namespace without feedUrl", () => {
		const xml = renderFeed(channel, []);
		expect(xml).not.toContain("atom:link");
		expect(xml).not.toContain("xmlns:atom");
	});

	test("escapes all five XML special characters", () => {
		const xml = renderFeed({ ...channel, title: `T <>&"'` }, [
			{
				title: `Tom & Jerry <again>`,
				url: `https://example.com/?q=<>&"'`,
				date: new Date("2024-01-15T00:00:00.000Z"),
				description: `"quoted" & 'single'`,
			},
		]);
		expect(xml).toContain("<title>T &lt;&gt;&amp;&quot;&apos;</title>");
		expect(xml).toContain("<title>Tom &amp; Jerry &lt;again&gt;</title>");
		expect(xml).toContain("<link>https://example.com/?q=&lt;&gt;&amp;&quot;&apos;</link>");
		expect(xml).toContain("<description>&quot;quoted&quot; &amp; &apos;single&apos;</description>");
	});

	test("renders multiple items in order", () => {
		const xml = renderFeed(channel, [
			{ title: "one", url: "https://example.com/one", date: new Date("2024-01-01T00:00:00.000Z") },
			{ title: "two", url: "https://example.com/two", date: new Date("2024-02-01T00:00:00.000Z") },
		]);
		expect(xml).toContain("<title>one</title>");
		expect(xml).toContain("<title>two</title>");
		expect(xml.indexOf("<title>one</title>")).toBeLessThan(xml.indexOf("<title>two</title>"));
	});

	test("derives lastBuildDate from the newest item", () => {
		const xml = renderFeed(channel, [
			{ title: "old", url: "https://example.com/old", date: new Date("2024-01-01T00:00:00.000Z") },
			{ title: "new", url: "https://example.com/new", date: new Date("2024-03-01T08:00:00.000Z") },
			{ title: "mid", url: "https://example.com/mid", date: new Date("2024-02-01T00:00:00.000Z") },
		]);
		expect(xml).toContain("<lastBuildDate>Fri, 01 Mar 2024 08:00:00 GMT</lastBuildDate>");
	});

	test("empty items iterable produces a valid feed without items or lastBuildDate", () => {
		const xml = renderFeed(channel, []);
		expect(xml).toContain("</rss>");
		expect(xml).not.toContain("<item>");
		expect(xml).not.toContain("<lastBuildDate>");
	});

	test("accepts a generator as input", () => {
		function* items(): Generator<FeedItem> {
			yield { title: "one", url: "https://example.com/one", date: new Date("2024-01-01T00:00:00.000Z") };
			yield { title: "two", url: "https://example.com/two", date: new Date("2024-02-01T00:00:00.000Z") };
		}
		const xml = renderFeed(channel, items());
		expect(xml).toContain("<link>https://example.com/one</link>");
		expect(xml).toContain("<link>https://example.com/two</link>");
	});

	test("throws TypeError on missing channel fields", () => {
		expect(() => renderFeed({ ...channel, title: "" }, [])).toThrow(TypeError);
		expect(() => renderFeed({ ...channel, link: "" }, [])).toThrow(TypeError);
		expect(() => renderFeed({ ...channel, description: "" }, [])).toThrow(TypeError);
	});

	test("throws TypeError on item without a valid date", () => {
		expect(() => renderFeed(channel, [{ title: "a", url: "https://example.com/a" } as unknown as FeedItem])).toThrow(
			TypeError,
		);
		expect(() =>
			renderFeed(channel, [{ title: "a", url: "https://example.com/a", date: new Date("nonsense") }]),
		).toThrow(TypeError);
	});

	test("uses LF line endings", () => {
		const xml = renderFeed(channel, [
			{ title: "a", url: "https://example.com/a", date: new Date("2024-01-15T00:00:00.000Z") },
		]);
		expect(xml).not.toContain("\r\n");
	});
});

describe("writeFeed", () => {
	const tmp = join(tmpdir(), "sphido-feed-test");

	afterEach(async () => {
		await rm(tmp, { recursive: true, force: true });
	});

	test("writes the file and creates nested directories", async () => {
		const file = join(tmp, "deep", "nested", "feed.xml");
		await writeFeed(
			file,
			renderFeed(channel, [{ title: "a", url: "https://example.com/a", date: new Date("2024-01-15T00:00:00.000Z") }]),
		);

		const content = await readFile(file, "utf-8");
		expect(content).toContain("<link>https://example.com/a</link>");
		expect(content).toContain("</rss>");
	});

	test("overwrites an existing file", async () => {
		const file = join(tmp, "feed.xml");
		await writeFeed(
			file,
			renderFeed(channel, [
				{ title: "old", url: "https://example.com/old", date: new Date("2024-01-01T00:00:00.000Z") },
			]),
		);
		await writeFeed(
			file,
			renderFeed(channel, [
				{ title: "new", url: "https://example.com/new", date: new Date("2024-02-01T00:00:00.000Z") },
			]),
		);

		const content = await readFile(file, "utf-8");
		expect(content).not.toContain("https://example.com/old");
		expect(content).toContain("<link>https://example.com/new</link>");
	});
});
