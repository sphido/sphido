const globby = require('globby');
const Sphido = require('../../index');

(async () => {

	// get list of pages...
	const pages = await Sphido.getPages(await globby(__dirname + '/content/**/*.{md,html}'), ...Sphido.extenders);

	// save pages...
	for await (const page of pages) {
		await page.save(
				page.dir.replace('content', 'public'),
		);
	}

})();