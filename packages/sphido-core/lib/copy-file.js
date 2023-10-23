import {copyFile as copyFileAsync} from 'node:fs/promises';
import {dirname} from 'node:path';
import {mkdir} from 'node:fs/promises';

/**
 * Write content to the file and create directory if not exists
 *
 * @param {string} src
 * @param {string} dest
 * @returns {Promise<*>}
 */
export async function copyFile(src, dest) {
	await mkdir(dirname(dest), {recursive: true});
	return copyFileAsync(src, dest);
}
