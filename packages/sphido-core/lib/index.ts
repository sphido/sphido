import type { Dirent } from "node:fs";

export { allPages } from "./all-pages.js";
export { copyFile } from "./copy-file.js";
export { getPages } from "./get-pages.js";
export { readFile } from "./read-file.js";
export { writeFile } from "./write-file.js";

export type Extender = ExtenderCallback | ExtenderObject;

export type Extenders = Array<Extender>;

export type Page = {
	name: string;
	path: string;
	content?: string;
	children?: Pages;
	// biome-ignore lint/suspicious/noExplicitAny: There can be any key from frontmatter
	[key: string]: any;
};

export type Pages = Array<Page>;

export type Options = { path?: string; include?: IncludePage };

export type ExtenderCallback = (page: Page, dirent: Dirent, path?: string) => Promise<void> | void;

export type ExtenderObject = Record<string, unknown>;

export type IncludePage = (dirent: Dirent, path?: string) => boolean;
