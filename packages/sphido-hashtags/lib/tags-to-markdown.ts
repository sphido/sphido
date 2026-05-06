import slugify from "@sindresorhus/slugify";

/** * Convert #hashtags to Markdown links */
export function tagsToMarkdown(
	content: string,
	tags: readonly string[] | null = [],
	{ urlBase = "/tag/", tagToUrl = slugify }: { urlBase?: string; tagToUrl?: (s: string) => string } = {},
): string {
	if (tags && tags.length > 0) {
		const anchor = new RegExp(`(${tags.join("|")})`, "gmi");
		return content.replace(
			anchor,
			(match: string, capture: string): string => `[${match}](${urlBase}${tagToUrl(capture)})`,
		);
	}

	return content;
}
