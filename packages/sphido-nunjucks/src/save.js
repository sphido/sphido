'use strict';

const {join} = require('path');
const {existsSync} = require('fs-extra');
const {toFile} = require('./template');

const defaultTemplate = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{page.title}}</title></head><body><main><article>{{page.content|safe}}</article></main></body></html>';

module.exports = {
	/**
	 * Save page to file
	 * @param {string} dir
	 * @param {string} template
	 * @returns {Promise<*>}
	 */
	async save(dir, template = 'theme/page.html') {
		template = this.template || template;

		return toFile(
			join(dir, this.slug, 'index.html'),
			template.endsWith('.html') && !existsSync(template) ? defaultTemplate : template,
			{page: this}
		);
	}

};
