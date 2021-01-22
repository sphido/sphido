# @sphido/sitemap

## Install

```bash
yarn add @sphido/sitemap
```

## Example

```javascript
import fs from 'fs-extra';
import {sitemap} from '@sphido/sitemap';

const posts = [
	{link: 'https://example.com/first', date: new Date()},
	{link: 'https://example.com/second', date: new Date()},
];

(async () => {
	await fs.outputFile(
		__dirname  + '/sitemap.xml',
		sitemap(posts, 'https://example.com')
	);
})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-sitemap