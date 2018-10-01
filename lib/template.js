'use strict';

// -----------------------------------------
// @see https://mozilla.github.io/nunjucks/
// -----------------------------------------

const {existsSync, outputFile} = require('fs-extra');
const nunjucks = require('nunjucks');
const env = nunjucks.configure('.', {autoescape: true});

// Default filters
env.addFilter('slug', require('@sindresorhus/slugify'));
env.addFilter('h1strip', (content) => content.replace(/<h1.*>.*?<\/h1>/g, ''));

module.exports = {
	addFilter: env.addFilter,
	render: nunjucks.render,
	renderString: nunjucks.renderString,
	toFile: async (file, template, vars) => {
		await outputFile(
				file,
				existsSync(template) ? nunjucks.render(template, vars) : nunjucks.renderString(template, vars)
		)
	},
};