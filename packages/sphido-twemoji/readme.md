# @sphido/twemoji

## Install

```bash
yarn add @sphido/twemoji
```

## Example

```js
const globby = require('globby');
const {getPages} = require('@sphido/core');

const PageExtenders = [
	require('@sphido/frontmatter'),
	require('@sphido/twemoji'),
	require('@sphido/marked'),
	require('@sphido/meta'),
];


(async () => {

	const posts = await getPages(
		await globby('packages/**/*.md'),
		...PageExtenders
	);

})();
```

## Reference

* https://twemoji.twitter.com/