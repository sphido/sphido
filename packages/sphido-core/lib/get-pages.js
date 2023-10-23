import {join, parse} from 'node:path';
import {readdir} from 'node:fs/promises';
import {isPage} from './is-page.js';

/**
 * Retrieve an array tree of pages from path
 *
 * @param {Options}
 * @param {Extenders} extenders
 * @return {Promise<Awaited<Pages>[]>}
 */
export async function getPages({path = 'content', include = isPage} = {}, ...extenders) {
  const dir = await readdir(path, {withFileTypes: true});

  return Promise.all(
    dir
      .filter(dirent => include(dirent, path))
      .map(async dirent => {
        // Page object
        const page = {name: parse(dirent.name).name, path: join(path, dirent.name)};

        // Read subdirectory recursively
        if (dirent.isDirectory()) {
          page.children = await getPages({path: page.path, include}, ...extenders);
        }

        // Calling callbacks in the series
        for (const cb of extenders.filter(f => typeof f === 'function')) {
          /** @type {ExtenderCallback} */
          await cb(page, dirent, path);
        }

        // Assign objects with page
        return Object.assign(page, ...extenders.filter(o => typeof o === 'object'));
      }));
}

/**
 * @typedef {Array.<Object|ExtenderCallback>} Extenders
 * @typedef {Array.<Page>} Pages
 * @typedef {{name: string, path: string, children?: Pages}} Page
 * @typedef {{path: string, include?: IncludePage}} Options
 */

/**
 * @callback ExtenderCallback
 * @param {Page} page
 * @param {import('node:fs').Dirent} dirent
 * @param {string=} path
 */

/**
 * @callback IncludePage
 * @param {import('node:fs').Dirent} dirent
 * @param {string=} path
 */
