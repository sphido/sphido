/**
 * Page generator that flatten pages structure
 * @param {array} pages
 * @returns {any}
 */
export function * listPages(pages) {
	for (const page of pages) {
		if (page?.children) {
			yield * listPages(page.children);
		} else {
			delete page.children;
			yield page;
		}
	}
}