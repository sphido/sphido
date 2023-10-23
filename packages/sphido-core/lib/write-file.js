import {writeFile as writeFileAsync} from 'node:fs/promises';
import {dirname} from 'node:path';
import {mkdir} from 'node:fs/promises';

/**
 * Write content to the file and create directory if not exists
 *
 * @param {string} file
 * @param {string} content
 * @returns {Promise<*>}
 */
export async function writeFile(file, content) {
  await mkdir(dirname(file), {recursive: true});
  return writeFileAsync(file, content);
}
