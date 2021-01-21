# @sphido/emoji

Sphido extender that add support for https://twemoji.twitter.com/
 
## Install

```bash
yarn add @sphido/emoji
```

## Example

```javascript
import globby from 'globby' 
import {getPages} from '@sphido/core';
import {frontmatter} from '@sphido/frontmatter';
import {emoji} from '@sphido/twemoji';

(async () => {

	const posts = await getPages(
		await globby('packages/**/*.md'),
		...[
	frontmatter,
	emoji,
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