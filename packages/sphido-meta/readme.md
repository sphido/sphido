# @sphido/meta


## Install

```bash
yarn add @sphido/marked
```

```js
const globby = require('globby');
const {save} = require('@sphido/nunjucks');
const {getPages} = require('@sphido/core');

(async () => {

	const posts = await getPages(
		await globby('content/**/*.md'),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
		],
	);

})();