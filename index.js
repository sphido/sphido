'use strict';

const {join} = require('path');
const {outputFile} = require('fs-extra');
const globby = require('globby');
const {getPages} = require('@sphido/core');

(async () => {

	// get list of pages...
	const posts = await getPages(
		await globby('packages/**/*.md'),
		...[
			require('@sphido/frontmatter'),
			require('@sphido/marked'),
			require('@sphido/meta')
		]
	);

	// save to html

	for await (const page of posts) {

		await outputFile(
			join(__dirname, 'public', page.dir.replace('packages', ''), 'index.html'),
			`<!DOCTYPE html>\n<html>` +
			`\n<head><title>${page.title}</title></head>` +
			`\n<body><div>${page.content}</div></body>` +
			`\n</html>`
		);

	}
})();
