import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/** Escape text for XML element content (order: `&` first). */
function escapeXml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

type Changefreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapParams {
	url: string;
	date?: Date;
	priority?: number;
	changefreq?: Changefreq;
}

export type Sitemap = {
	add: (params: SitemapParams) => void;
	end: () => Promise<void>;
};

/**
 * Generate XML sitemap
 * @see https://www.sitemaps.org/protocol.html
 */
export async function createSitemap(file = "public/sitemap.xml"): Promise<Sitemap> {
	await mkdir(dirname(file), { recursive: true });

	// Default "w" flag truncates an existing file
	const sitemap = createWriteStream(file);
	sitemap.write('<?xml version="1.0" encoding="UTF-8"?>\n');
	// The protocol requires exactly this (http) namespace URI
	sitemap.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

	return {
		add({ url, date = new Date(), priority = 0.5, changefreq = "monthly" }: SitemapParams): void {
			sitemap.write("\t<url>\n");
			sitemap.write(`\t\t<loc>${escapeXml(String(url))}</loc>\n`);
			sitemap.write(`\t\t<lastmod>${date.toISOString()}</lastmod>\n`);
			sitemap.write(`\t\t<priority>${Math.min(1, Math.max(0, priority))}</priority>\n`);
			sitemap.write(`\t\t<changefreq>${changefreq}</changefreq>\n`);
			sitemap.write("\t</url>\n");
		},

		end() {
			return new Promise<void>((resolve, reject) => {
				sitemap.once("error", reject);
				sitemap.end("</urlset>\n", resolve);
			});
		},
	};
}
