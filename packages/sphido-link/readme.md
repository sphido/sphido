# @sphido/link

`@sphido/link` is **extender function** that add `link()` to `page` and allow create valid URL link to `page` 


## Install

```bash
yarn add @sphido/link
```

## Example

```javascript
import {link} from '@sphido/link';
import {frontmatter} from '@sphido/frontmatter';
import {meta} from '@sphido/meta';
import {markdown} from '@sphido/markdown'; 
import {getPage} from '@sphido/core';

(async () => {

	const page = await getPage('/example.html',
		...[
            frontmatter,
            markdown,
            meta,
			{link}
		]
	);

	console.log(page.link());
})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-link