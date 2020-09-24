# @sphido/meta

[![npm version](https://badge.fury.io/js/%40sphido%2Fmeta.svg)](https://badge.fury.io/js/%40sphido%2Fmeta)

Page extender that add follow properties to `page` object:

* `page.title` - try detect correct title from `page.content` 
* `page.date` - detect date if is not set by date of last change 
* `page.slug` - using [slugify](https://github.com/sindresorhus/slugify) to made url safe slug
* `page.tags` - create Set from tags

## Install

```bash
yarn add @sphido/marked
```

```javascript
const globby = require('globby');
const {save} = require('@sphido/nunjucks');
const {getPages} = require('@sphido/core');

(async () => {

	const pages = await getPages(
		await globby('content/**/*.md'),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
		],
	);

})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-meta