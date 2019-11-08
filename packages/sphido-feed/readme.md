# @sphido/feed

## Install

```bash
yarn add @sphido/feed
```

## Example

```js
const {outputFile} = require('fs-extra');
const SphidoFeed = require('../src/index');

const posts = [
	{title: 'First article',link: 'https://example.com/first', content: '<p>article content</p>', description: 'Short description', date: new Date()},
	{title: 'Second article', link: 'https://example.com/second', content: '<p>article content</p>', description: 'Short description', date: new Date()},
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

	await outputFile(__dirname  + '/feed.xml', feed);
})();
```