import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);

/**
 * Return {page} object
 * @param {String} file
 * @param {Object.<string, number>} extenders
 * @returns {Promise<*>}
 */
export async function getPage(file, ...extenders) {
	const ext = path.extname(file);

	const page = {
		file,
		dir: path.relative('.', path.dirname(file)),
		ext,
		base: path.basename(file, ext),
		content: await readFile(file, 'utf8')
	};

	// Callbacks only
	extenders.filter(f => typeof f === 'function').map(f => f(page));

	// Assign objects
	return Object.assign(page, ...extenders.filter(f => typeof f === 'object'));
}
