#!/usr/bin/env node

const {join} = require('path');
const {existsSync, outputFile} = require('fs-extra');
const globby = require('globby');
const Sphido = require('../..');


(async () => {
	// 1. Get list of pages...
	const pages = await Sphido.getPages(
		await globby(join(__dirname, '/content/**/*.{md,html}')),
		...Sphido.extenders
	);

	// 2. Save pages... (with default HTML template)
	for await (const page of pages) {



		console.log(page.slug);
		await outputFile(
			join(page.dir.replace('content', 'public'), page.slug + '.json'),
			JSON.stringify(page, null, 2)
		);

	}
})();
