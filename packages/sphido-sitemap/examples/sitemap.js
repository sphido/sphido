import sitemap from '../lib/sitemap.js';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const posts = [
	{
		link: 'https://example.com/first',
		date: new Date()
	},
	{
		link: 'https://example.com/second',
		date: new Date()
	}
];

(async () => {
	const output = sitemap(posts, 'https://example.com/');
	await fs.outputFile(path.join(__dirname, '/sitemap.xml'), output);
})();
