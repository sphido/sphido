'use strict';

const {readFile} = require('fs-extra');
const {dirname, extname, basename} = require('path');

/**
 * Return {page} object
 * @param file
 * @param extenders
 * @returns {Promise<*>}
 */
module.exports = async (file, ...extenders) => {
	let ext = extname(file);
	let content = await readFile(file, 'utf8');

	let page = {
		file: file,
		dir: dirname(file),
		ext: ext,
		base: basename(file, ext),
		content: content,
	};

	// callbacks
	extenders.filter(f => typeof f === 'function').map(f => f(page));

	// assign objects
	return Object.assign(
			page,
			...extenders.filter(f => typeof f === 'object'),
	);
};