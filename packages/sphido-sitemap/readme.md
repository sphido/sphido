# @sphido/sitemap

## Install

```bash
yarn add @sphido/sitemap
```

## Example

```javascript
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

	// prepare sitemap item properties
	page.url = new URL(page.slug, 'https://sphido.cz');
	page.date = new Date();
	page.priority = 0.5;
	page.changefreq = 'daily';

	// add page to sitemap
	map.add(page);
}

map.end();
```

## Let them know

### Google

Google expects the standard sitemap protocol in all formats.
Google does not currently consume the `<priority>` attribute in sitemaps.
You can also submit RSS or Atom files.

Google doesn't check a sitemap every time a site is crawled; a sitemap is checked only
the first time that we notice it, and thereafter only when you ping us to let us know
that it's changed. Alert Google about a sitemap only when it's new or updated;
don't submit or ping unchanged sitemaps multiple times.

You can use e.g. [got](https://github.com/sindresorhus/got) an HTTP request library for Node.js
or visit [URL manually](https://www.google.com/webmasters/tools/ping?sitemap=https://sphido.cz/sitemap.xml)

```javascript
import got from 'got';
await got.get('https://www.google.com/webmasters/tools/ping?sitemap=URL');
```

### Bing, Seznam, Yandex

[IndexNow](https://www.indexnow.org/) is an open-source protocol that allows website publishers to
instantly index across participating search engines, updating results based upon the latest content changes.
[IndexNow](https://www.indexnow.org/) protocol is supported by [Microsoft Bing](https://www.bing.com/indexnow), [Seznam.cz](https://www.seznam.cz/) and Yandex.

1. **Generate an API Key** – This is submitted alongside URLs to ensure ownership of the domain. You can use [Microsoft Bing API Key generator](https://www.bing.com/indexnow).
2. **Host API Key** – Your API key is hosted on the root directory in `txt` format.
3. **Submit URLs with Parameters** – You can either submit URLs individually or in bulk as sitemap file.

```text
https://www.bing.com/indexnow?url=[URL]&key=[YOUR KEY]
https://search.seznam.cz/indexnow?url=[URL]&key=[YOUR KEY]
```

## Source codes

[@sphido/sitemap](https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap)