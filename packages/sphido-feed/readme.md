# @sphido/feed

Generate atom feed from `pages`

## Install

```bash
yarn add @sphido/feed
```

## Example

```javascript
import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';
import {feed} from '@sphido/feed';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const posts = [
	{
		title: 'First article',
		link: 'https://example.com/first',
		content: '<p>article content</p>',
		description: 'Short description',
		date: new Date()
	},
	{
		title: 'Second article',
		link: 'https://example.com/second',
		content: '<p>article content</p>',
		description: 'Short description',
		date: new Date()
	},
];

(async () => {

	const output = feed(
		posts,
		{
			title: 'Feed of example.com',
			description: 'This is my Atom feed',
			link: 'https://example.com',
		},
		'https://example.com/feed.xml'
	);

	await fs.outputFile(__dirname  + '/feed.xml', output);
})();
```

https://github.com/sphido/examples/tree/master/rss

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-feed