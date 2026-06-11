import type { Page, Pages } from "@sphido/core";

export type Siblings = {
	prev: Page | null;
	next: Page | null;
};

/** * Previous and next page by identity within the given ordered array */
export function siblings(pages: Pages, page: Page): Siblings {
	const index = pages.indexOf(page);
	if (index === -1) return { prev: null, next: null };

	return {
		prev: index > 0 ? pages[index - 1] : null,
		next: index < pages.length - 1 ? pages[index + 1] : null,
	};
}
