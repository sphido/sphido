# @sphido/twemoji

Sphido extender that add support for https://twemoji.twitter.com/
 
## Install

```bash
yarn add @sphido/twemoji
```

## Example

```javascript
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

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-twemoji