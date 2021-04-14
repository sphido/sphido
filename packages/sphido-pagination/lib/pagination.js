/**
 * Generate pagination
 * @returns {AsyncIterableIterator<*>}
 * @param {array} posts
 * @param {int} perPage
 */
export async function * pagination(posts, perPage = 5) {
	const pages = Math.ceil(posts.length / perPage);
	let current = 1;

	while (current <= pages) {
		yield {
			posts: posts.slice(perPage * (current - 1), current * perPage),
			current,
			pages
		};
		current++;
	}
}
