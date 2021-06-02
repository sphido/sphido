import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'fs-extra';
import {feed} from '../lib/feed.js';

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
	}
];

(async () => {
	const rss = feed(
		posts,
		{
			title: 'Feed of example.com',
			description: 'This is my Atom feed',
			link: 'https://example.com'
		},
		'https://example.com/feed.xml'
	);

	await fs.outputFile(path.join(__dirname, '/feed.xml'), rss);
})();
