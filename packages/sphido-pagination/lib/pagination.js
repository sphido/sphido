/**
 * Generate pages range
 * @param {int} total
 */
function * pages(total) {
	for (let i = 1; i <= total; i++) {
		yield i;
	}
}

/**
 * Generate pagination
 * @returns {AsyncIterableIterator<*>}
 * @param {array} posts
 * @param {int} perPage
 */
export async function * pagination(posts, perPage = 5) {
	const total = Math.ceil(posts.length / perPage);
	let current = 1;

	while (current <= total) {
		yield {
			total,
			posts: posts.slice(perPage * (current - 1), current * perPage),
			current,
			pages: [...pages(total)],
		};
		current++;
	}
}
