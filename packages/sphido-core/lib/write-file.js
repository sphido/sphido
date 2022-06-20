import {mkdir, writeFile as writeFileAsync} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {dirname} from 'node:path';

/**
 * Write content to the file and create directory if not exists
 *
 * @param {string} file
 * @param {string} content
 * @returns {Promise<*>}
 */
export async function writeFile(file, content) {
	if (!existsSync(dirname(file))) {
		await mkdir(dirname(file), {recursive: true});
	}

	return writeFileAsync(file, content);
}
