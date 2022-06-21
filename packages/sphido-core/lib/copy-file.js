import {mkdir, copyFile as copyFileSync} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {dirname} from 'node:path';

/**
 * Write content to the file and create directory if not exists
 *
 * @param {string} file
 * @param {string} content
 * @returns {Promise<*>}
 */
export async function copyFile(src, dest) {
	if (!existsSync(dirname(src))) {
		await mkdir(dirname(src), {recursive: true});
	}

	return copyFileSync(src, dest);
}
