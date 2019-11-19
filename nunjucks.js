const globby = require('globby');
const {save} = require('@sphido/nunjucks');
const {getPages} = require('@sphido/core');


(async () => {


	// 1. get list of pages...
	const posts = await getPages(
		await globby('packages/**/*.md'),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta'),
			{
				save,
				aaa: () => console.log(this)
			}
		],
	);

	// 2. save to html with default template
	for await (const page of posts) {
		//console.log(page);

		page.aaa()
		/*
		await page.save(
			page.dir.replace('content', 'public')
		);
		 */
	}
})();