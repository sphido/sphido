const globby = require('globby');
const Sphido = require('../../index');

(async () => {

	// get list of pages...
	const pages = await Sphido.getPages(await globby(__dirname + '/content/**/*.{md,html}'), ...Sphido.extenders);

	for await (const page of pages) {

		// set render template (default is template/single.html)
		page.template = 'examples/basic/single.html';

		// save page to HTML
		await page.save(
				page.dir.replace('content', 'public')
		);
	}

})();