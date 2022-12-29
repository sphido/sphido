[![NPM Downloads](https://img.shields.io/npm/dm/@sphido/core?style=for-the-badge)](https://www.npmjs.com/package/wticons)
[![NPM Version](https://img.shields.io/npm/v/@sphido/core?style=for-the-badge)](https://www.npmjs.com/package/wticons)
[![NPM License](https://img.shields.io/npm/l/@sphido/core?style=for-the-badge)](https://github.com/OzzyCzech/wticons/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/sphido/sphido?style=for-the-badge)](https://github.com/OzzyCzech/wticons/commit/main)

<p align="center">
  <a href="https://sphido.org">
    <img src="https://sphido.org/img/sphido.svg" width="420px" alt="Sphido logo"/>
  </a>
</p>

<p align="center">
  A rocket 🚀 fast, ️💭 lightweight and flexible static site 🤖 generator.
</p>

* 🚀 rocket fast
* ️💭 lightweight
* 🤘 no dependencies
* ⚡️ flexible

## Installation

```bash
$ yarn add @sphido/core
```

or 

```bash
$ npm i @sphido/core
```

## Quick Start

```javascript
#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, readFile, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';

const pages = await getPages({path: 'content'}, // ... extenders
	(page) => {
		page.slug = slugify(page.name) + '.html';
		page.dir = dirname(page.path);
	});

for (const page of allPages(pages)) {
	page.output = join('public', relative('content', page.dir), page.slug);
	page.content = marked(await readFile(page.path));

	await writeFile(page.output, `<!DOCTYPE html>
		<html lang="en" dir="ltr">
		<head>
			<meta charset="UTF-8">
			<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
			<title>${page.name} | Sphido Example</title>
		</head>
		<body class="prose mx-auto my-6">${page.content}</body>
		<!-- Generated by Sphido from ${page.path} -->
		</html>
	`);
}
```

## Packages

* [`@sphido/core`](https://github.com/sphido/sphido/tree/main/packages/sphido-core) - core functions `getPages()`, `allPages()`, `readFile()` and `writeFile()`

### Page extenders

* [`@sphido/frontmatter`](https://github.com/sphido/sphido/tree/main/packages/sphido-frontmatter) - frontmatter extender for `page`
* [`@sphido/hashtags`](https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags) - process hashtags in `page.content`

### Website components

* [`@sphido/sitemap`](https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap) - generate `sitemap.xml` file

## Examples

* https://github.com/sphido/examples/
* https://sphido.org

## License

MIT