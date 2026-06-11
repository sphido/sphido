import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, parse } from "node:path";
import type { ExtenderCallback, ExtenderObject, Extenders, Options, Page } from "./index.js";
import { isPage } from "./is-page.js";

/** * Retrieve an array tree of pages from path */
export async function getPages<T extends Page = Page>(
	{ path = "content", include = isPage }: Options = {},
	...extenders: Extenders<T>
): Promise<T[]> {
	const dir: Dirent[] = await readdir(path, { withFileTypes: true });

	return Promise.all(
		dir
			.filter((dirent) => include(dirent, path))
			.map(async (dirent) => {
				// Page object
				const page = {
					name: parse(dirent.name).name,
					path: join(path, dirent.name),
				} as T;

				// Read subdirectory recursively
				if (dirent.isDirectory()) {
					page.children = await getPages<T>({ path: page.path, include }, ...extenders);
				}

				// Calling callbacks in the series
				for (const cb of extenders.filter((f): f is ExtenderCallback<T> => typeof f === "function")) {
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
