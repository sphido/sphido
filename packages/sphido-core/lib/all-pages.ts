import type { Page, Pages } from "./index.js";

/** * Page generator that flatten pages structure */
export function* allPages(pages: Pages): Generator<Page> {
	for (const page of pages) {
		if (page?.children) {
			yield* allPages(page.children);
		} else {
			yield page;
		}
	}
}
