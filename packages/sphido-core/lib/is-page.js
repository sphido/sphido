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
export function isPage(dirent) {
  // Accept only *.md, *.html files
  if (dirent.isFile() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.')) {
    return dirent.name.endsWith('.md') || dirent.name.endsWith('.html');
  }

  // Or not hidden directory
  return dirent.isDirectory() && !dirent.name.startsWith('.');
}
