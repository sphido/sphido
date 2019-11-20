# @sphido/link

## Install

```bash
yarn add @sphido/link
```

## Example

```js
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