/**
 * Generate sitemap XML from posts
 * @param pages
 * @param options
 * @returns {string}
 */
module.exports = function (pages, domain) {
	return `<?xml version="1.0" encoding="UTF-8"?>` +
		`<url><loc>${domain}</loc><lastmod>${new Date().toISOString()}</lastmod><priority>1.0</priority></url>\n` +
		pages.map(post => `<url><loc>${post.link}</loc><lastmod>${post.date.toISOString()}</lastmod><priority>0.80</priority></url>\n`).join('') +
		`</urlset>`;
};