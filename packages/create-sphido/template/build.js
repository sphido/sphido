import { dirname, join, relative } from "node:path";
import slugify from "@sindresorhus/slugify";
import { allPages, getPages, writeFile } from "@sphido/core";
import { frontmatter } from "@sphido/frontmatter";
import { hashtags } from "@sphido/hashtags";
import { pagesToSitemap, writeSitemap } from "@sphido/sitemap";
import { marked } from "marked";
import { layout } from "./layout.js";

export async function build() {
	const pages = await getPages(
		{ path: "content" },
		frontmatter, // reads YAML front matter into page.title, page.description, page.date, ...
		hashtags, // turns #hashtags in page.content into links and collects them in page.tags
		(page) => {
			page.slug = `${slugify(page.name)}.html`;
			page.url = join(relative("content", dirname(page.path)), page.slug).replaceAll("\\", "/");
		},
	);

	for (const page of allPages(pages)) {
		page.content = marked(page.content ?? "");
		await writeFile(join("public", page.url), layout(page));
	}

	const xml = pagesToSitemap(pages, { baseUrl: "https://example.com" });
	await writeSitemap("public/sitemap.xml", xml);

	console.log("Site generated into public/");
}
