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
import {createSitemap, pingSitemap} from '@sphido/sitemap';
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

// ping Google about new sitemap
await got.get('https://www.google.com/webmasters/tools/ping?sitemap=https://sphido.org/sitemap.xml');
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

You can use [got](https://github.com/sindresorhus/got) - Human-friendly and powerful HTTP request library for Node.js
or visit [URL manually](https://www.google.com/webmasters/tools/ping?sitemap=https://sphido.org/sitemap.xml)

```javascript
import got from 'got';
await got.get('https://www.google.com/webmasters/tools/ping?sitemap=https://sphido.org/sitemap.xml');
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

https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap