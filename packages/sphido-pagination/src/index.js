'use strict';

/**
 * Generate pagination
 * @returns {AsyncIterableIterator<*>}
 * @param posts
 * @param perPage
 */
module.exports = async function* pagination(posts, perPage = 5) {
	let pages = [...new Array(Math.ceil(posts.length / perPage)).keys()].map(i => ++i);
	for await (let current of pages) {
		yield {
			posts: posts.slice(perPage * (current - 1), current * perPage),
			current: current,
			pages: pages,
		};
	}
};