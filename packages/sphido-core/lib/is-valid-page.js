/**
 * Default page filter
 *
 * - skip hidden files (starts with .)
 * - skip and directories (starts with .)
 * - skip drafts files with underscore at the beginning
 * - accept only *.html and *.md files
 *
 * @param dirent
 * @returns {boolean}
 */
export function isValidPage(dirent) {
	// accept only *.md, *.html files
	if (dirent.isFile() && !dirent.name.startsWith('_') && !dirent.name.startsWith('.')) {
		return dirent.name.endsWith('.md') || dirent.name.endsWith('.html');
	}

	// or not hidden directory
	return dirent.isDirectory() && !dirent.name.startsWith('.');
}
