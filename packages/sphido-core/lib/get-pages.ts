import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import type { ExtenderCallback, ExtenderObject, Extenders, Options, Page, Pages } from "./index.js";
import { isPage } from "./is-page.js";

/** * Retrieve an array tree of pages from path */
export async function getPages(
	{ path = "content", include = isPage }: Options = {},
	...extenders: Extenders
): Promise<Pages> {
	const dir: Dirent[] = await readdir(path, { withFileTypes: true });

	return Promise.all(
		dir
			.filter((dirent) => include(dirent, path))
			.map(async (dirent) => {
				// Page object
				const page: Page = {
					name: parse(dirent.name).name,
					path: join(path, dirent.name),
				};

				// Read subdirectory recursively
				if (dirent.isDirectory()) {
					page.children = await getPages({ path: page.path, include }, ...extenders);
				}

				// Calling callbacks in the series
				for (const cb of extenders.filter((f): f is ExtenderCallback => typeof f === "function")) {
					await cb(page, dirent, path);
				}

				// Assign objects with page
				return Object.assign(
					page,
					...extenders.filter((o): o is ExtenderObject => typeof o === "object" && o !== null),
				);
			}),
	);
}
