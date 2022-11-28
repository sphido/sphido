/**
 * Page generator that flatten pages structure
 *
 * @param {import('get-pages.js').Pages} pages
 * @return {import('get-pages.js').Page}
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
