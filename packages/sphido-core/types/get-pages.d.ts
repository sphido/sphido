/**
 * Retrieve an array tree of pages from path
 *
 * @param {Options}
 * @param {Extenders} extenders
 * @return {Promise<Awaited<Pages>[]>}
 */
export function getPages({ path, include }?: Options, ...extenders: Extenders): Promise<Awaited<Pages>[]>;
export type Extenders = Array<any | ExtenderCallback>;
export type Pages = Array<Page>;
export type Page = {
    name: string;
    path: string;
    children?: Page[];
};
export type Options = {
    path: string;
    include?: IncludePage;
};
export type ExtenderCallback = (page: Page, dirent: import('node:fs').Dirent, path?: string | undefined) => any;
export type IncludePage = (dirent: import('node:fs').Dirent, path?: string | undefined) => any;
