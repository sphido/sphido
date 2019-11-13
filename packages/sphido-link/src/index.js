'use strict';

const {sep, normalize} = require('path');

module.exports = {
	/**
	 * Generate link to current page
	 * @returns {string}
	 */
	link() {
		return '/' + normalize(this.dir + sep + this.slug + sep)
			.split(sep)
			.splice(1)
			.join('/');
	}
};
