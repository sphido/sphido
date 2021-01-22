# @sphido/meta

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
import globby from 'globby';
import {getPages} from '@sphido/core';
import {frontmatter} from '@sphido/frontmatter';
import {meta} from '@sphido/meta';
import {markdown} from '@sphido/markdown';

(async () => {

	const pages = await getPages(
		await globby('content/**/*.md'),
		...[
			frontmatter,
            markdown,
            meta,
		],
	);

})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-meta