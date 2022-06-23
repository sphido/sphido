/**
 * Page generator that flatten pages structure
 *
 * @generator
 * @param {array} pages
 * @yields {name:string, path:string} next page in pages list
 */
export function * allPages(pages) {
	for (const page of pages) {
		if (page?.children) {
			yield * allPages(page.children);
		} else {
			yield page;
		}
	}
}
