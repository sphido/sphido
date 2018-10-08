#!/usr/bin/env node

const globby = require('globby');
const Sphido = require('../../index');

(async () => {

	// 1. Get list of pages...
	const pages = await Sphido.getPages(await globby('content/**/*.{md,html}'), ...Sphido.extenders,
			(page) => {
				page.author = 'John Appleseed'; // add Custom property to all pages
				page.title = page.title + ' | add to all titles';
			},
			{
				custom() {
					return  '// call custom function on ' + this.base + this.ext;
				}
			}
	);

	// 2. Save page to HTML
	for await (const page of pages) {
		await page.save(
				page.dir.replace('content', 'public')
		);
	}

})();