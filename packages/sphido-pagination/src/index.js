'use strict';

/**
 * Generate pagination
 * @returns {AsyncIterableIterator<*>}
 * @param {array} posts
 * @param {int} perPage
 */
module.exports = async function * (posts, perPage = 5) {
	const pages = [...new Array(Math.ceil(posts.length / perPage)).keys()].map(i => ++i);
	for await (const current of pages) {
		yield {
			posts: posts.slice(perPage * (current - 1), current * perPage),
			current,
			pages
		};
	}
};
