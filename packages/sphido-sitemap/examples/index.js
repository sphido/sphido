#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {createSitemap} from '@sphido/sitemap';
import got from 'got';

const pages = await getPages({path: 'content'});
const map = await createSitemap('sitemap.xml');

map.add({url: 'https://sphido.org', priority: 1});

for (const page of await allPages(pages)) {
	page.slug = join('/', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	map.add({
		url: 'https://sphido.org' + page.slug,
		date: new Date(),
	});
}

map.end();

// Ping Google about new sitemap
await got.get('https://www.google.com/webmasters/tools/ping?sitemap=https://sphido.org/sitemap.xml');
