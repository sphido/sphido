import {readFile} from 'node:fs/promises';

/**
 * Read file content as string
 * @param {string} path
 * @returns {Promise<*>}
 */
export async function fromFile(path) {
	return await readFile(path, 'utf8');
}