import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import type { ExtenderCallback, Extenders, Options, Page, Pages } from "./index.js";
import { isPage } from "./is-page.js";

/**
 * Retrieve an array tree of pages from path
 */
export async function getPages(
	{ path = "content", include = isPage }: Options = {},
	...extenders: Extenders
): Promise<Pages> {
	const dir: Dirent[] = await readdir(path, { withFileTypes: true });

	return Promise.all(
		dir
			.filter((dirent) => include(dirent, path.toString()))
			.map(async (dirent) => {
				// Page object
				const page: Page = {
					name: parse(dirent.name).name,
					path: join(path.toString(), dirent.name),
				};

				// Read subdirectory recursively
				if (dirent.isDirectory()) {
					page.children = await getPages({ path: page.path, include }, ...extenders);
				}

				// Calling callbacks in the series
				for (const cb of extenders.filter((f: ExtenderCallback): boolean => typeof f === "function")) {
					await cb(page, dirent, path.toString());
				}

				// Assign objects with page
				return Object.assign(page, ...extenders.filter((o: ExtenderCallback): boolean => typeof o === "object"));
			}),
	);
}
