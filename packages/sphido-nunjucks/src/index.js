'use strict';

// -----------------------------------------
// @see https://mozilla.github.io/nunjucks/
// -----------------------------------------

const {existsSync, outputFile} = require('fs-extra');
const {render, renderString, configure} = require('nunjucks');
const {striptags, truncate} = require('nunjucks/src/filters');

const env = configure('.', {autoescape: true});

// Default filters
env.addFilter('h1strip', str => str.replace(/<h1.*>.*?<\/h1>/g, ''));

// {{page.content|short}}
// FXIME remove (it can be replaced with default functions...)
env.addFilter('short', (str, length) => truncate(striptags(str.replace(/<h1[^>]*?>[\s\S]*?<\/h1>/i, '')), length || 380));

module.exports = {
	addFilter: env.addFilter,
	render,
	renderString,
	saveToFile: async (file, template, vars) => {
		await outputFile(
			file,
			existsSync(template) ? render(template, vars) : renderString(template, vars)
		);
	}
};
