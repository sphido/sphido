'use strict'

const {join} = require('path');
const {outputFile} = require('fs-extra');

const globby = require('globby');
const Sphido = require('@sphido/core');
const SphidoPagination = require('@sphido/pagination');

const PageExtenders = [
	require('@sphido/frontmatter'),
	require('@sphido/marked'),
	require('@sphido/meta'),
];

(async () => {

	// get list of pages...
	const posts = await Sphido.getPages(
		await globby('packages/**/*.md'),
		...PageExtenders
	);

	for await (const page of posts) {
		// save page to HTML (with default theme/page.html)
		// from content ===> public directory

		/*
		await outputFile(
			join(__dirname, 'public', page.slug + '.html'),

			`<!DOCTYPE html>
      <html>
      <head>
        <title>${page.title}</title>
      </head>
      <body>
        <div>${page.content}</div>
        <!-- ${JSON.stringify(page, null, 2)}-->
      </body>
    </html>`
		);
		*/


		// pages
		await outputFile(
			join(__dirname, 'public', page.slug + '.json'),
			`${JSON.stringify(page, null, 2)}`
		);


		// pagination
		const pages = SphidoPagination(posts, 3);
		for await (const page of pages) {
			console.log(page.posts); // list of posts on current page
			console.log(page.current); // current page no
			console.log(page.pages); // array of other pages
		}

	}

})();