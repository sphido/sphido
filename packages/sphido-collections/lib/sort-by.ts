import type { Page, Pages } from "@sphido/core";

export type SortValue = string | number | Date | undefined;

export type SortDirection = "asc" | "desc";

/** * Stable sort of pages by the selector result; undefined values go last; returns a new array */
export function sortBy(pages: Pages, selector: (page: Page) => SortValue, direction: SortDirection = "asc"): Pages {
	const sign = direction === "desc" ? -1 : 1;

	return [...pages].sort((a, b) => {
		const left = normalize(selector(a));
		const right = normalize(selector(b));

		// Undefined values always go last, regardless of direction
		if (left === undefined && right === undefined) return 0;
		if (left === undefined) return 1;
		if (right === undefined) return -1;

		if (left < right) return -sign;
		if (left > right) return sign;
		return 0;
	});
}

function normalize(value: SortValue): string | number | undefined {
	return value instanceof Date ? value.getTime() : value;
}
