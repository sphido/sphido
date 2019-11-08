'use strict';

// -----------------------------------------
// @see https://mozilla.github.io/nunjucks/
// -----------------------------------------

const {existsSync, outputFile} = require('fs-extra');
const {render, renderString, configure} = require('nunjucks');

const env = configure('.', {autoescape: true});

// Default filters
env.addFilter('slug', require('@sindresorhus/slugify'));

env.addFilter('h1strip', content => content.replace(/<h1.*>.*?<\/h1>/g, ''));

module.exports = {
	addFilter: env.addFilter,
	render,
	renderString,
	toFile: async (file, template, vars) => {
		await outputFile(
			file,
			existsSync(template) ? render(template, vars) : renderString(template, vars)
		);
	}
};
