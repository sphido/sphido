import type { Page, Pages } from "./index.js";

/** * Page generator that flatten pages structure */
export function* allPages<T extends Page = Page>(pages: Pages<T>): Generator<T> {
	for (const page of pages) {
		if (page?.children) {
			yield* allPages(page.children as Pages<T>);
		} else {
			yield page;
		}
	}
}
