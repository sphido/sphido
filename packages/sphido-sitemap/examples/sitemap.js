const {join} = require('path');
const {outputFile} = require('fs-extra');
const sphidoSitemap = require('..');

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
	const sitemap = sphidoSitemap(posts, 'https://example.com/');
	await outputFile(join(__dirname, '/sitemap.xml'), sitemap);
})();
