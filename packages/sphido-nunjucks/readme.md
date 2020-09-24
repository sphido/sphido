# @sphido/nunjucks

[![npm version](https://badge.fury.io/js/%40sphido%2Fnunjucks.svg)](https://badge.fury.io/js/%40sphido%2Fnunjucks)

This package allow use [nunjucks](https://mozilla.github.io/nunjucks/) - a rich and powerful templating language for JavaScript from Mozilla
for rendering HTML files from page object.

Functions:

- `env.addFilter(name, func, [async])` -  allow [addFilter](https://mozilla.github.io/nunjucks/api.html#getfilter) to [nunjucks](https://mozilla.github.io/nunjucks) template engine.
- `nunjucks.render(name, [context], [callback])` - render the template see [nunjucks docs](https://mozilla.github.io/nunjucks/api.html#render)
- `nunjucks.renderString(str, context, [callback])` - 
- `renderToFile(file, template, vars = undefined)` - render the template to file

Extenders: 

- `save(dir, template = 'theme/page.html')` - function extender allow save page to file

## Install

```bash
yarn add @sphido/nunjucks
```

## Usage

```javascript
const globby = require('globby');
const {save} = require('@sphido/nunjucks');
const {getPages} = require('@sphido/core');

(async () => {

	// 1. get list of pages...
	const posts = await getPages(
		await globby('content/**/*.md'),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
		],
		{save}
	);

	// 2. save to html with default template
	for await (const page of posts) {
		page.save(
			page.dir.replace('content', 'public')
		);
	}
})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-nunjucks