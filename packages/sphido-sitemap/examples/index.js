#!/usr/bin/env node

import { dirname, join, relative } from "node:path";
import slugify from "@sindresorhus/slugify";
import { getPages } from "@sphido/core";
import { pagesToSitemap, writeSitemap } from "@sphido/sitemap";

const pages = await getPages({ path: "content" }, (page) => {
	page.slug = `${slugify(page.name)}.html`;
	page.url = join("/", relative("content", dirname(page.path)), page.slug);
	page.date = new Date();
});

const xml = pagesToSitemap(pages, {
	baseUrl: "https://sphido.cz",
	defaults: { priority: 0.5, changefreq: "daily" },
});

await writeSitemap("sitemap.xml", xml);
