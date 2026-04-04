# @sphido/sitemap

Generates [XML sitemap](https://www.sitemaps.org/protocol.html) files for Sphido CMS.

## Install

```bash
pnpm add @sphido/sitemap
```

## Example

```javascript
#!/usr/bin/env node

import { dirname, relative, join } from 'node:path';
import { getPages, allPages } from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import { createSitemap } from '@sphido/sitemap';

const pages = await getPages({path: 'content'});
const map = await createSitemap('sitemap.xml');

map.add({url: 'https://sphido.cz', priority: 1});

for (const page of await allPages(pages)) {
	page.slug = slugify(page.name) + '.html';
	page.output = join('/', relative('content', dirname(page.path)), page.slug);

	// prepare sitemap item properties
	page.url = new URL(page.slug, 'https://sphido.cz');
	page.date = new Date();
	page.priority = 0.5;
	page.changefreq = 'daily';

	// add page to sitemap
	map.add(page);
}

await map.end();
```

## Source code

[@sphido/sitemap](https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap)