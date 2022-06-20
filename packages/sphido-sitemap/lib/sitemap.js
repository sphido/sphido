import {createWriteStream} from 'node:fs';
import {mkdir, unlink} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {dirname} from 'node:path';

/**
 * Generate XML sitemap
 * @param file
 * @returns {Object<{addUrl: add, end: end}>}
 */
export async function createSitemap(file = 'public/sitemap.xml') {
	// create directory
	if (!existsSync(dirname(file))) {
		await mkdir(dirname(file), {recursive: true});
	}

	// truncate file
	if (existsSync(file)) {
		await unlink(file);
	}

	// create stream
	const sitemap = createWriteStream(file, {flags: 'a'});
	sitemap.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');

	return {

		add: (url, lastmod = new Date(), priority = 0.8) => {
			sitemap.write(`\t<url><loc>${url}</loc><lastmod>${lastmod.toISOString()}</lastmod><priority>${priority}</priority></url>\r\n`);
		},

		end: () => {
			sitemap.write('</urlset>');
			sitemap.end();
		},
	};
}