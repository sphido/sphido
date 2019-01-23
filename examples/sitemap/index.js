#!/usr/bin/env node

const globby = require('globby');
const Sphido = require('../../index');

(async () => {

	// 1. Get pages from directory
	const pages = await Sphido.getPages(await globby(__dirname + '/content/**/*.{md,html}'), ...Sphido.extenders);

	// 2. Save them (with default template)
	for await (const page of pages) {
		await page.save(
			page.dir.replace('content', 'public')
		);
	}

	// 3. Generate sitemap.xml
	await Sphido.template.toFile(
		__dirname + '/public/sitemap.xml',
		__dirname + '/theme/sitemap.xml',
		{
			pages: pages,
			domain: 'https://example.com'
		}
	);

})();