import type { Pages } from "@sphido/core";
import { allPages, writeFile } from "@sphido/core";

const ESC: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
};

/** Escape text for XML element content in a single pass */
function escapeXml(text: string): string {
	return text.replace(/[&<>"']/g, (c) => ESC[c]);
}

export type Changefreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapEntry {
	url: string | URL;
	lastmod?: Date | string;
	priority?: number;
	changefreq?: Changefreq;
}

export interface PagesToSitemapOptions {
	baseUrl: string | URL;
	defaults?: Partial<Omit<SitemapEntry, "url">>;
}

/**
 * Render an XML sitemap from an iterable of entries.
 *
 * Only <loc> is mandatory per protocol — optional fields are emitted
 * only when present on the entry.
 *
 * @see https://www.sitemaps.org/protocol.html
 */
export function renderSitemap(entries: Iterable<SitemapEntry>): string {
	const parts: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>\n',
		// The protocol requires exactly this (http) namespace URI
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n',
	];

	for (const { url, lastmod, priority, changefreq } of entries) {
		parts.push("\t<url>\n", `\t\t<loc>${escapeXml(url instanceof URL ? url.href : String(url))}</loc>\n`);

		if (lastmod !== undefined) {
			parts.push(
				`\t\t<lastmod>${escapeXml(lastmod instanceof Date ? lastmod.toISOString() : String(lastmod))}</lastmod>\n`,
			);
		}

		if (priority !== undefined) {
			parts.push(`\t\t<priority>${Math.min(1, Math.max(0, priority))}</priority>\n`);
		}

		if (changefreq !== undefined) {
			parts.push(`\t\t<changefreq>${changefreq}</changefreq>\n`);
		}

		parts.push("\t</url>\n");
	}

	parts.push("</urlset>\n");
	return parts.join("");
}

/**
 * Map a Sphido pages tree to sitemap XML.
 *
 * The page URL is taken from page.url ?? page.slug ?? `${page.name}.html`
 * and resolved against baseUrl; lastmod comes from page.lastmod ?? page.date
 * (no filesystem access — stat mtimes yourself if you need them).
 */
export function pagesToSitemap(pages: Pages, { baseUrl, defaults = {} }: PagesToSitemapOptions): string {
	return renderSitemap(pageEntries(pages, baseUrl, defaults));
}

function* pageEntries(
	pages: Pages,
	baseUrl: string | URL,
	defaults: Partial<Omit<SitemapEntry, "url">>,
): Generator<SitemapEntry> {
	for (const page of allPages(pages)) {
		const lastmod = page.lastmod ?? page.date;
		yield {
			...defaults,
			url: new URL(String(page.url ?? page.slug ?? `${page.name}.html`), baseUrl),
			...(lastmod !== undefined && { lastmod }),
			...(page.priority !== undefined && { priority: page.priority }),
			...(page.changefreq !== undefined && { changefreq: page.changefreq }),
		};
	}
}

/** Write sitemap XML to a file, creating the directory when needed */
export async function writeSitemap(file: string, xml: string): Promise<void> {
	return writeFile(file, xml);
}
