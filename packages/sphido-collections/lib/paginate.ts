import type { Pages } from "@sphido/core";

export type Pagination = {
	items: Pages;
	page: number;
	total: number;
	prev: number | null;
	next: number | null;
};

/** * Split pages into 1-based chunks of perPage items; empty input returns an empty array */
export function paginate(pages: Pages, perPage: number): Pagination[] {
	if (!Number.isInteger(perPage) || perPage < 1) {
		throw new RangeError(`perPage must be a positive integer, got ${perPage}`);
	}

	const total = Math.ceil(pages.length / perPage);
	const chunks: Pagination[] = [];

	for (let page = 1; page <= total; page++) {
		chunks.push({
			items: pages.slice((page - 1) * perPage, page * perPage),
			page,
			total,
			prev: page > 1 ? page - 1 : null,
			next: page < total ? page + 1 : null,
		});
	}

	return chunks;
}
