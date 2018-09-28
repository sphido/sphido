const globby = require('globby');
const Sphido = require('../../index');

(async () => {


	// get list of pages...
	const pages = await Sphido.getPages(await globby(__dirname + '/content/**/*.{md,html}'), ...Sphido.extenders,
			(page) => {
				page.author = 'John Appleseed'; // add Custom property to all pages
				page.template = 'examples/custom-extenders/single.html';
				page.title = page.title + ' | add to all titles';
			},
			{
				custom() {
					return  '// call custom function on ' + this.base + this.ext;
				}
			}
	);

	for await (const page of pages) {
		// save page to HTML
		await page.save(
				page.dir.replace('content', 'public')
		);
	}

})();