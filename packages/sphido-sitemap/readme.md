# @sphido/sitemap


## Install

```bash
yarn add @sphido/sitemap
```

## Example

```js
const {outputFile} = require('fs-extra');
const SphidoSitemap = require('@sphido/sitemap');

const posts = [
	{link: 'https://example.com/first', date: new Date()},
	{link: 'https://example.com/second', date: new Date()},
];

(async () => {
	const sitemap = SphidoSitemap(posts, 'https://example.com');
	await outputFile(__dirname  + '/sitemap.xml', sitemap);
})();
```