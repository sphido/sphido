'use strict';

const getPage = require('./get-page');

/**
 * Return list of pages from directory
 * @param {Array} files
 * @param {Array} extenders
 * @returns {Promise<any[]>}
 */
module.exports = async (files, ...extenders) => Promise.all(
	files.map(
		file => getPage(file, ...extenders)
	)
);
