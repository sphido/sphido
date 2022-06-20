#!/usr/bin/env node

import {getPages, listPages} from '@sphido/core';
import {createSitemap} from '../lib/sitemap.js';
import slugify from '@sindresorhus/slugify';

const pages = await getPages({path: 'content'});
const index = await createSitemap('sitemap.xml');

index.add('https://sphido.org', new Date(), 1.0);

for (const page of await listPages(pages)) {
	index.add('https://sphido.org/' + slugify(page.name), new Date());
}

index.end();