'use strict';

const getPage = require('./getPage');

/**
 * Return list of pages from directory
 * @param files
 * @param extenders
 * @returns {Promise<any[]>}
 */
module.exports = async (files, ...extenders) => await Promise.all(
		await files.map(
				async file => await getPage(file, ...extenders)
		)
);