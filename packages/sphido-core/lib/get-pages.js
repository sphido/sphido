import {getPage} from './get-page.js';

/**
 * Return list of pages from directory
 * @param {Array} files
 * @param {Array} extenders
 * @returns {Promise<any[]>}
 */
export const getPages = async (files, ...extenders) => Promise.all(
	files.map(
		file => getPage(file, ...extenders)
	)
);
