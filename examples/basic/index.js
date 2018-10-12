#!/usr/bin/env node

const globby = require('globby');
const Sphido = require('../../index');

(async () => {

	// 1. Get list of pages...
	const pages = await Sphido.getPages(await globby('content/**/*.{md,html}'), ...Sphido.extenders);

	// 2. Save pages... (with default HTML template)
	for await (const page of pages) {
		await page.save(
				page.dir.replace('content', 'public')
		);
	}

})();