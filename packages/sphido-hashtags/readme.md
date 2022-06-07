# @sphido/hashtags

Find hashtags and replaces them with a link code `[#hashtag](/tag/hashtag)`

## Install

```bash
yarn add @sphido/hashtags
```

```javascript
import globby from 'globby';
import {getPages} from '@sphido/core';
import {hashtags} from '@sphido/hashtags';
import {markdown} from '@sphido/markdown';

(async () => {

	const pages = await getPages(
		await globby('content/**/*.md'),
		...[
			hashtags,
			markdown,
		],
	);

})();
```

## Source codes

https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags