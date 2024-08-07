import slugify from "@sindresorhus/slugify";

/** * Convert #hashtags to Markdown links */
export function tagsToMarkdown(content: string, tags = [], { urlBase = "/tag/", tagToUrl = slugify } = {}): string {
	if (tags && tags.length > 0) {
		const anchor = new RegExp(`(${tags.join("|")})`, "gmi");
		return content.replace(
			anchor,
			(match: string, capture: string): string => `[${match}](${urlBase}${tagToUrl(capture)})`,
		);
	}

	return content;
}
