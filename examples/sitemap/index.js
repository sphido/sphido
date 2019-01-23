#!/usr/bin/env node

const {join} = require('path');
const globby = require('globby');
const Sphido = require('../..');

(async () => {
	// 1. Get pages from directory
	const pages = await Sphido.getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...Sphido.extenders
	);

	// 2. Save them (with default template)
	for await (const page of pages) {
		await page.save(
			page.dir.replace('content', 'public')
		);
	}

	// 3. Generate sitemap.xml
	await Sphido.template.toFile(
		join(__dirname, '/public/sitemap.xml'),
		join(__dirname, '/theme/sitemap.xml'),
		{
			pages,
			domain: 'https://example.com'
		}
	);
})();
