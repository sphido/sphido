import {join} from 'node:path';
import {parse} from 'node:path';
import {readdir} from 'node:fs/promises';
import {isValidPage} from './is-valid-page.js';

/**
 * Return tree of pages from path
 * @param path
 * @param filter
 * @param extenders
 * @returns {Promise<Awaited<unknown>[]>}
 */
export async function getPages({path, filter = isValidPage}, ...extenders) {
	return await Promise.all((await readdir(path, {withFileTypes: true}))
		.filter(dirent => filter(dirent))
		.map(async (dirent) => {
			const page = {name: parse(dirent.name).name, path: join(path, dirent.name)};

			// Read subdirectory recursively
			if (dirent.isDirectory()) {
				page.children = await getPages({...page, filter}, ...extenders);
			}

			// Callbacks
			extenders.filter(f => typeof f === 'function').map(f => f(page, path, dirent));

			// Assign objects
			return Object.assign(page, ...extenders.filter(o => typeof o === 'object'));
		}));
}
