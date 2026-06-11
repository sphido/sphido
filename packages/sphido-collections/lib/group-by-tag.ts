import type { Pages } from "@sphido/core";

/** * Group pages by tag; accepts Set or array values, returns a Map with keys sorted by tag name */
export function groupByTag(pages: Pages, key = "tags"): Map<string, Pages> {
	const groups = new Map<string, Pages>();

	for (const page of pages) {
		const value: unknown = page[key];
		if (!(value instanceof Set) && !Array.isArray(value)) continue;

		// Deduplicate array values so a page is never listed twice under one tag
		for (const tag of new Set<unknown>(value)) {
			if (typeof tag !== "string") continue;
			const tagged = groups.get(tag);
			if (tagged) {
				tagged.push(page);
			} else {
				groups.set(tag, [page]);
			}
		}
	}

	return new Map([...groups].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}
