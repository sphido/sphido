'use strict';

const fs = require('fs-extra');
const {promisify} = require('util');
const outputFile = promisify(fs.outputFile);

// -----------------------------------------
// @see https://mozilla.github.io/nunjucks/
// -----------------------------------------

const slugify = require('@sindresorhus/slugify');
const nunjucks = require('nunjucks');

const env = nunjucks.configure('.', {autoescape: true});

// Filters
env.addFilter('slug', slugify);
env.addFilter('h1strip', (content) => content.replace(/<h1.*>.*?<\/h1>/g, ''));

module.exports = {
	env: env,
	numjucks: nunjucks,
	toFile: async (output, template, vars) => await outputFile(output, nunjucks.render(template, vars))
};