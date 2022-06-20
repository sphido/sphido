/**
 * Page generator that flatten pages structure
 * @param {array} pages
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
