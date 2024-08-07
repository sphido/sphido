import type { Dirent, PathLike } from "node:fs";

export { getPages } from "./get-pages.js";
export { allPages } from "./all-pages.js";
export { readFile } from "./read-file.js";
export { writeFile } from "./write-file.js";
export { copyFile } from "./copy-file.js";

export type Extenders = Array<ExtenderCallback>;

export type Page = {
	name: string;
	path: string;
	content?: string;
	children?: Pages;
	// biome-ignore lint/suspicious/noExplicitAny: There can be any key from frontmatter
	[key: string]: any;
};

export type Pages = Array<Page>;

export type Options = { path?: PathLike; include?: IncludePage };

export type ExtenderCallback = (page: Page, dirent: Dirent, path?: string) => Promise<void>;

export type IncludePage = (dirent: Dirent, path?: string) => void;
