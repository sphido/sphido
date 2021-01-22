# @sphido/feed

Generate atom feed from `pages`

## Install

```bash
yarn add @sphido/feed
```

## Example

```javascript
import fs from 'fs-extra';
import {feed} from '@sphido/feed';

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

	const feed = SphidoFeed(
		posts,
		{
			title: 'Feed of example.com',
			description: 'This is my Atom feed',
			link: 'https://example.com',
		},
		'https://example.com/feed.xml'
	);

	await rs.outputFile(__dirname  + '/feed.xml', feed);
})();
```

https://github.com/sphido/examples/tree/master/rss

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-feed