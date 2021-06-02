import path from 'node:path';

/**
 * Generate link to current page
 * @param {string} domain
 * @returns {string}
 */
export function link(domain = '/') {
	return domain + path.normalize(this.dir + path.sep + this.slug + path.sep)
		.split(path.sep)
		.splice(1)
		.join('/');
}
