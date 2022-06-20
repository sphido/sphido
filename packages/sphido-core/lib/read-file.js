import {readFile as readFileAsync} from 'node:fs/promises';

/**
 * Read file content as string
 * @param {string} path
 * @returns {Promise<*>}
 */
export async function readFile(path) {
	return readFileAsync(path, 'utf8');
}
