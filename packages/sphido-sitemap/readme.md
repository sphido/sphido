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
import {createSitemap} from '../lib/sitemap.js';

const pages = await getPages({path: 'content'});
const map = await createSitemap('sitemap.xml');

map.add('https://sphido.org', new Date(), 1);

for (const page of await allPages(pages)) {
	page.slug = join('/', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	map.add('https://sphido.org' + page.slug, new Date());
}

map.end();
```

## Source codes

https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap