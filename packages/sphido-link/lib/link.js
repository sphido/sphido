'use strict';

const {sep, normalize} = require('path');

module.exports = {
	/**
	 * Generate link to current page
	 * @param {string} domain
	 * @returns {string}
	 */
	link(domain = '/') {
		return domain + normalize(this.dir + sep + this.slug + sep)
			.split(sep)
			.splice(1)
			.join('/');
	}
};
