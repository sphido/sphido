import {statSync} from 'node:fs';
import {inspect} from 'node:util';
import slugify from '@sindresorhus/slugify';

const headline = /(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i;

/**
 * Process page metadata like title, author, slug ...
 * @param {Object} page
 */
export function meta(page) {
	page.content = page.content || '';
	page.title = (page.title || (page.content.match(headline) || [page.base || '']).pop()).trim();
	page.slug = page.slug || slugify(page.title);
	page.date = page.date || (page.file ? new Date(inspect(statSync(page.file).mtime)) : new Date());
	page.tags = new Set(page.tags || []);
}
