'use strict';

const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);
/**
 * Async file reader
 * @param path
 * @returns {Promise<Buffer>}
 */
module.exports = async (path) => {
	return await readFilePromise(path);
};