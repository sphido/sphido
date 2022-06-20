<p align="center">
  <a href="https://sphido.org">
    <img src="https://sphido.org/img/sphido.svg" width="480px"/>
  </a>
</p>


<p align="center">
  A rocket 🚀 fast, light-weight and flexible static site generator.
</p>

* 🚀 rocket fast
* ️⚖️ light-weight
* 🤘 no dependencies
* ⚡️ flexible

## Installation

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

function getHtml({name, content, path}) {
	return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
	<title>${name} | Sphido Example page</title>	
</head>
<body class="prose mx-auto my-6">${content}</body>
<!-- Generated with Sphido from ${path} -->
</html>`;
}

const pages = await getPages({path: 'content'}, (page) => {
	page.slug = slugify(page.name) + '.html';
});

for (const page of allPages(pages)) {
	page.output = join('public', relative('content', dirname(page.path)), page.slug);

	// read content and process markdown
	page.content = marked(await readFile(page.path));

	// save HTML file
	await writeFile(page.output, getHtml(page));
}
```

## Packages

* [`@sphido/core`](https://github.com/sphido/sphido/tree/main/packages/sphido-core) - core functions `getPages()` and `allPages()`

### Page extenders

* [`@sphido/frontmatter`](https://github.com/sphido/sphido/tree/main/packages/sphido-frontmatter) - frontmatter extender for pages
* [`@sphido/hashtags`](https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags) - process hashtags in `page.content`

### Website components

* [`@sphido/sitemap`](https://github.com/sphido/sphido/tree/main/packages/sphido-sitemap) - generate `sitemap.xml` file

## Examples

* https://github.com/sphido/examples/

## License

MIT