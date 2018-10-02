'use strict';

const {sep, normalize} = require('path');

module.exports = {
	/**
	 * Generate link to current page
	 * @returns {string}
	 */
	url() {
		return normalize(
				sep + this.dir.substr(this.dir.indexOf(sep) + 1) + sep + this.slug + sep
		).split(sep).join('/');
	}
};