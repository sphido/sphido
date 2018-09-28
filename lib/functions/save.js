'use strict';

const {join} = require('path');
const {toFile} = require('../render');

module.exports = {
	/**
	 * Save page to file
	 * @param path
	 * @returns {Promise<*>}
	 */
	async save(dir) {
		return await toFile(
				join(dir, this.slug, 'index.html'),
				this.template || 'template/single.html',
				{page: this})
	}
};