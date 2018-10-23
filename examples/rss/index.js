#!/usr/bin/env node

const globby = require('globby');
const Sphido = require('../../index');

(async () => {

	// 1. Get pages from directory
	const pages = await Sphido.getPages(await globby('content/**/*.{md,html}'), ...Sphido.extenders);

	// 2. Save them (with default template)
	for await (const page of pages) {
		await page.save(
				page.dir.replace('content', 'public')
		);
	}

	// 2.1 sort pages by date

	pages.sort((a, b) => new Date(b.date) - new Date(a.date));


	// 3. Generate RSS
	await Sphido.template.toFile(
			'public/rss.xml',
			'theme/rss.xml',
			{
				title: 'RSS Title',
				description: 'RSS Description',
				domain: 'https://example.com',
				pages: pages.slice(0, 15),
			}
	);

})();