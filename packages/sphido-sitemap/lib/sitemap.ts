import { createWriteStream, existsSync } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
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

interface SitemapParams {
	url: string;
	date?: Date;
	priority?: number;
	changefreq?: "daily" | "weekly" | "monthly" | "yearly";
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
	// Create directory
	if (!existsSync(dirname(file))) {
		await mkdir(dirname(file), { recursive: true });
	}

	// Truncate file
	if (existsSync(file)) {
		await unlink(file);
	}

	// Create stream
	const sitemap = createWriteStream(file, { flags: "a" });
	sitemap.write('<?xml version="1.0" encoding="UTF-8"?>\n');
	sitemap.write('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n');

	return {
		add({ url, date = new Date(), priority = 0.5, changefreq = "monthly" }: SitemapParams): void {
			sitemap.write("\t<url>\n");
			sitemap.write(`\t\t<loc>${escapeXml(String(url))}</loc>\n`);
			sitemap.write(`\t\t<lastmod>${date.toISOString()}</lastmod>\n`);
			sitemap.write(`\t\t<priority>${priority}</priority>\n`);
			sitemap.write(`\t\t<changefreq>${changefreq}</changefreq>\n`);
			sitemap.write("\t</url>\n");
		},

		end() {
			return new Promise<void>((resolve, reject) => {
				sitemap.write("</urlset>");
				sitemap.end();
				sitemap.on("finish", resolve);
				sitemap.on("error", reject);
			});
		},
	};
}
