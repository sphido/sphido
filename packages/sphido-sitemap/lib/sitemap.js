import {createWriteStream, existsSync} from 'node:fs';
import {mkdir, unlink} from 'node:fs/promises';
import {dirname} from 'node:path';

/**
 * Generate XML sitemap
 * @see https://www.sitemaps.org/protocol.html
 * @param {string} file
 * @return {Promise<{add({url: string, date?: Date, priority?: Number, changefreq?: string}=): void, end(): void}>}
 */
export async function createSitemap(file = 'public/sitemap.xml') {
	// Create directory
	if (!existsSync(dirname(file))) {
		await mkdir(dirname(file), {recursive: true});
	}

	// Truncate file
	if (existsSync(file)) {
		await unlink(file);
	}

	// Create stream
	const sitemap = createWriteStream(file, {flags: 'a'});
	sitemap.write('<?xml version="1.0" encoding="UTF-8"?>\r\n');
	sitemap.write('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\r\n');

	return {
		/**
		 * Add URL to sitemap
		 * @param {string} url
		 * @param {Date} date
		 * @param {Number} priority
		 * @param {string} changefreq
		 */

		add({url, date = new Date(), priority = 0.5, changefreq = 'monthly'} = {}) {
			sitemap.write('\t<url>\r\n');
			sitemap.write(`\t\t<loc>${url}</loc>\r\n`);
			sitemap.write(`\t\t<lastmod>${date.toISOString()}</lastmod>\r\n`);
			sitemap.write(`\t\t<priority>${priority}</priority>\r\n`);
			sitemap.write(`\t\t<changefreq>${changefreq}</changefreq>\r\n`);
			sitemap.write('\t</url>\r\n');
		},

		/**
		 * Save sitemap end
		 */
		end() {
			sitemap.write('</urlset>');
			sitemap.end();
		},
	};
}
