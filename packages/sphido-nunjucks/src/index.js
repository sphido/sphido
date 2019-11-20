'use strict';

const {join} = require('path');
const {render, renderString, configure} = require('nunjucks');
const {existsSync, outputFile} = require('fs-extra');
const env = configure('.', {autoescape: true});

// -----------------------------------------
// @see https://mozilla.github.io/nunjucks/
// -----------------------------------------

const defaultTemplate = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{page.title}}</title></head><body><main><article>{{page.content|safe}}</article></main></body></html>';

/**
 * Render template to file
 * @param {string} file
 * @param {string} template
 * @param {Object} vars
 * @returns {Promise<void>}
 */
async function renderToFile(file, template, vars = undefined) {
	await outputFile(file, existsSync(template) ? render(template, vars) : renderString(template, vars));
}

/**
 * Sphido page extender for save
 * @param {string} dir
 * @param {string} template
 * @returns {Promise<void>}
 */
async function save(dir, template = 'theme/page.html') {
	template = this.template || template;

	return renderToFile(
		join(dir, this.slug, 'index.html'),
		template.endsWith('.html') && !existsSync(template) ? defaultTemplate : template,
		{page: this}
	);
}

module.exports = {
	env,
	render,
	renderString,
	renderToFile,
	save
};
