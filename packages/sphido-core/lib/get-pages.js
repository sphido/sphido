import {join, parse} from 'node:path';
import {readdir} from 'node:fs/promises';
import {isPage as isPageDefault} from './is-page.js';

/**
 * Retrieve an array tree of pages from path
 * @param {string} path
 * @param {Function} isPage
 * @param extenders
 * @returns {Promise<Awaited<unknown>[{name, path}]>}
 */
export async function getPages({path = 'content', isPage = isPageDefault} = {}, ...extenders) {
	const dir = await readdir(path, {withFileTypes: true});

	return Promise.all(
		dir
			.filter(dirent => isPage(dirent))
			.map(async dirent => {
				// Page
				const page = {name: parse(dirent.name).name, path: join(path, dirent.name)};

				// Read subdirectory recursively
				if (dirent.isDirectory()) {
					page.children = await getPages({path: page.path, isPage}, ...extenders);
				}

				// Calling callbacks
				await Promise.all(extenders.filter(f => typeof f === 'function').map(f => f(page, dirent, path)));

				// Assign objects with page
				return Object.assign(page, ...extenders.filter(o => typeof o === 'object'));
			}));
}
