/**
 * Default page filter
 *
 * - skip hidden files (starts with .)
 * - skip and directories (starts with .)
 * - skip drafts files with underscore (_) at the beginning
 * - accept only *.html and *.md files
 *
 * @param {import('node:fs').Dirent} dirent
 * @returns {boolean}
 */
export function isPage(dirent: import('node:fs').Dirent): boolean;
