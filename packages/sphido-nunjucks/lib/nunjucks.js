import path from 'node:path';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';

export const env = nunjucks.configure('.', {autoescape: true});

// -----------------------------------------
// @see https://mozilla.github.io/nunjucks/
// -----------------------------------------

const defaultTemplate = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>{{page.title}}</title></head><body><main><article>{{page.content|safe}}</article></main></body></html>';

/**
 * Render template to file
 * @param {string} file
 * @param {string} template
 * @param {Object} vars
 * @returns {Promise<void>}
 */
export async function renderToFile(file, template, vars = undefined) {
	await fs.outputFile(file, fs.existsSync(template) ? nunjucks.render(template, vars) : nunjucks.renderString(template, vars));
}

/**
 * Sphido page extender for save
 * @param {string} dir
 * @param {string} template
 * @returns {Promise<void>}
 */
export async function save(dir, template = 'theme/page.html') {
	template = this.template || template;

	return renderToFile(
		path.join(dir, this.slug, 'index.html'),
		template.endsWith('.html') && !fs.existsSync(template) ? defaultTemplate : template,
		{page: this}
	);
}

export const {renderString} = nunjucks;
export const {render} = nunjucks;
