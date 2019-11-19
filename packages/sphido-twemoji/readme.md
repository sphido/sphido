# @sphido/twemoji

## Install

```bash
yarn add @sphido/twemoji
```

## Example

```js
const globby = require('globby');
const {getPages} = require('@sphido/core');


(async () => {

	const posts = await getPages(
		await globby('packages/**/*.md'),
		...[
	require('@sphido/frontmatter'),
	require('@sphido/twemoji'),
	require('@sphido/marked'),
	require('@sphido/meta'),
       ]
	);

})();
```

## Reference

* https://twemoji.twitter.com/