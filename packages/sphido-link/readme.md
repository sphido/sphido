# @sphido/link

`@sphido/link` is **extender function** that add `link()` to `page` and allow create valid URL link to `page` 


## Install

```bash
yarn add @sphido/link
```

## Example

```javascript
const globby = require('globby');
const {getPage} = require('@sphido/core');
const {link} = require('@sphido/link');

(async () => {

	const page = await getPage('/example.html',
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
			{link}
		]
	);

	console.log(page.link());
})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-link