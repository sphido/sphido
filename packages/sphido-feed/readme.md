# @sphido/feed

Generates valid [RSS 2.0](https://www.rssboard.org/rss-specification) feeds for Sphido CMS — as pure functions, no state to manage. The API matches `@sphido/sitemap` v4 (`render… → write…`).

## Install

```bash
pnpm add @sphido/feed
```

## Example

```javascript
#!/usr/bin/env node

import { dirname, join, relative } from 'node:path';
import { allPages, getPages } from '@sphido/core';
import { frontmatter } from '@sphido/frontmatter'; // reads title, date, description, author …
import slugify from '@sindresorhus/slugify';
import { renderFeed, writeFeed } from '@sphido/feed';

const pages = await getPages({path: 'content'}, frontmatter, (page) => {
	page.slug = slugify(page.name) + '.html';
	page.url = join('/', relative('content', dirname(page.path)), page.slug);
});

const xml = renderFeed(
	{
		title: 'My Blog',
		link: 'https://example.com',
		description: 'Notes about everything',
		language: 'en',
		feedUrl: 'https://example.com/feed.xml',
	},
	[...allPages(pages)].map((page) => ({
		title: page.title ?? page.name,
		url: new URL(page.url, 'https://example.com'),
		date: new Date(page.date),
		description: page.description,
		author: page.author,
	})),
);

await writeFeed('public/feed.xml', xml);
```

## API

### `renderFeed(channel, items)`

Renders an RSS 2.0 feed to an XML string.

The channel requires `title`, `link` and `description` (a `TypeError` is thrown when any of them is missing); `language` is optional. When `feedUrl` is provided, an `<atom:link rel="self">` element is emitted along with the `xmlns:atom` namespace — feed validators flag its absence.

`items` is any iterable (arrays and generators both work, so large sets need not be materialized). Each item requires `title`, `url` (string or `URL`) and `date` (a `Date`); `description` and `author` are optional. Items without a valid `date` are **not** skipped — a `TypeError` is thrown, because a feed with undated items is broken for every reader.

Details handled for you:

- dates are formatted as RFC 822 (`Date#toUTCString()`), as RSS requires — not ISO
- `<lastBuildDate>` is derived from the newest item date
- `<guid isPermaLink="true">` is set to the item URL
- all text content is XML-escaped

### `writeFeed(file, xml)`

Writes the XML to a file, creating parent directories when needed.

## Source code

[@sphido/feed](https://github.com/sphido/sphido/tree/main/packages/sphido-feed)
