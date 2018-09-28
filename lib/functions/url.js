'use strict';

const {sep} = require('path');

module.exports = {
	/**
	 * Generate link to current page
	 * @returns {string}
	 */
	url() {
		return [...this.dir.replace('content', '').split(sep), this.slug].join('/');
	}
};