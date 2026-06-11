# @sphido/sitemap

Generates [XML sitemap](https://www.sitemaps.org/protocol.html) files for Sphido CMS — as pure functions, no state to manage.

## Install

```bash
pnpm add @sphido/sitemap
```

## Example

```javascript
#!/usr/bin/env node

import { dirname, join, relative } from 'node:path';
import { getPages } from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import { pagesToSitemap, writeSitemap } from '@sphido/sitemap';

const pages = await getPages({path: 'content'}, (page) => {
	page.slug = slugify(page.name) + '.html';
	page.url = join('/', relative('content', dirname(page.path)), page.slug);
	page.date = new Date();
});

const xml = pagesToSitemap(pages, {
	baseUrl: 'https://sphido.cz',
	defaults: {priority: 0.5, changefreq: 'daily'},
});

await writeSitemap('public/sitemap.xml', xml);
```

## API

### `pagesToSitemap(pages, {baseUrl, defaults})`

Maps a Sphido pages tree (nested pages are flattened) to sitemap XML. For each page:

- the URL is `page.url ?? page.slug ?? page.name + '.html'`, resolved against `baseUrl`
- `lastmod` comes from `page.lastmod ?? page.date` (no filesystem access)
- `priority` and `changefreq` come from the page, falling back to `defaults`

### `renderSitemap(entries)`

Lowest level: renders any iterable of entries to an XML string. Only `url` is
required; `lastmod` (`Date` or string), `priority` (clamped to 0–1) and
`changefreq` (`always` … `never`) are emitted only when present. Composes with
generators, so large entry sets need not be materialized as arrays.

```javascript
import { renderSitemap } from '@sphido/sitemap';

const xml = renderSitemap([
	{url: 'https://sphido.cz', priority: 1},
	{url: 'https://sphido.cz/about.html', lastmod: new Date(), changefreq: 'monthly'},
]);
```

### `writeSitemap(file, xml)`

Writes the XML to a file, creating parent directories when needed.

## Source code

[@sphido/sitemap](https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap)
