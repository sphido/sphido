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

	// 3. Generate sitemap.xml
	await Sphido.template.toFile(
			'public/sitemap.xml',
			'theme/sitemap.xml',
			{
				pages: pages,
				date: new Date().toISOString(),
				domain: 'https://example.com'
			}
	);

})();