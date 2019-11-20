/**
 * Generate sitemap XML from posts
 * @param {array} pages
 * @param {string} domain
 * @returns {string}
 */
module.exports = (pages, domain) => {
	return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		`<url><loc>${domain}</loc><lastmod>${new Date().toISOString()}</lastmod><priority>1.0</priority></url>\n` +
		pages.map(post => `<url><loc>${typeof post.link === "function" ? post.link(domain) : post.link}</loc><lastmod>${post.date.toISOString()}</lastmod><priority>0.80</priority></url>\n`).join('') +
		'</urlset>';
};
