#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {createSitemap} from '@sphido/sitemap';
import got from 'got';

const pages = await getPages({path: 'content'});
const map = await createSitemap('sitemap.xml');

map.add({url: 'https://sphido.cz', priority: 1});

for (const page of await allPages(pages)) {
	page.slug = slugify(page.name) + '.html';
	page.output = join('/', relative('content', dirname(page.path)), page.slug);

	// Prepare sitemap item properties
	page.url = new URL(page.slug, 'https://sphido.cz');
	page.date = new Date();
	page.priority = 0.5;
	page.changefreq = 'daily';

	// Add page to sitemap
	map.add(page);
}

map.end();

// Ping Google about new sitemap
await got.get('https://www.google.com/webmasters/tools/ping?sitemap=https://sphido.cz/sitemap.xml');
