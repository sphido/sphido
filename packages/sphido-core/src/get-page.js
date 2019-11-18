'use strict';

const {dirname, relative, extname, basename} = require('path');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

/**
 * Return {page} object
 * @param {String} file
 * @param {Object.<string, number>} extenders
 * @returns {Promise<*>}
 */
module.exports = async (file, ...extenders) => {
	const ext = extname(file);
	const content = await readFile(file, 'utf8');

	const page = {
		file,
		dir: relative('.', dirname(file)),
		ext,
		base: basename(file, ext),
		content
	};

	// Callbacks only
	extenders.filter(f => typeof f === 'function').map(f => f(page));

	// Assign objects
	return Object.assign(page, ...extenders.filter(f => typeof f === 'object'));
};
