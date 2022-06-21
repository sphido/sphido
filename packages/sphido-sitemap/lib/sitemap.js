import {createWriteStream, existsSync} from 'node:fs';
import {mkdir, unlink} from 'node:fs/promises';
import {dirname} from 'node:path';

/**
 * Generate XML sitemap
 * @param {string} file
 * @returns {Object<{add: add, end: end}>}
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
	sitemap.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

	return {

		add(url, lastmod = new Date(), priority = 0.8) {
			sitemap.write(`\t<url><loc>${url}</loc><lastmod>${lastmod.toISOString()}</lastmod><priority>${priority}</priority></url>\r\n`);
		},

		end() {
			sitemap.write('</urlset>');
			sitemap.end();
		},
	};
}
