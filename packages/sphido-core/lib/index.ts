import type { Dirent } from "node:fs";

export { allPages } from "./all-pages.js";
export { copyFile } from "./copy-file.js";
export { getPages } from "./get-pages.js";
export { readFile } from "./read-file.js";
export { writeFile } from "./write-file.js";

export type Extender<T extends Page = Page> = ExtenderCallback<T> | ExtenderObject;

export type Extenders<T extends Page = Page> = Array<Extender<T>>;

export type Page = {
	name: string;
	path: string;
	content?: string;
	children?: Pages;
	// biome-ignore lint/suspicious/noExplicitAny: There can be any key from frontmatter
	[key: string]: any;
};

export type Pages<T extends Page = Page> = Array<T>;

export type Options = { path?: string; include?: IncludePage };

export type ExtenderCallback<T extends Page = Page> = (page: T, dirent: Dirent, path?: string) => Promise<void> | void;

export type ExtenderObject = Record<string, unknown>;

export type IncludePage = (dirent: Dirent, path?: string) => boolean;
