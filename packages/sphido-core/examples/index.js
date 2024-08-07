#!/usr/bin/env node

import { dirname, join, relative } from "node:path";
import slugify from "@sindresorhus/slugify";
import { allPages, copyFile, getPages, readFile, writeFile } from "@sphido/core";
import { marked } from "marked";

const pages = await getPages(
	{ path: "content" }, // ... extenders
	(page) => {
		page.slug = `${slugify(page.name)}.html`;
		page.dir = dirname(page.path);
	},
);

for (const page of allPages(pages)) {
	page.output = join("public", relative("content", page.dir), page.slug);
	page.content = marked(await readFile(page.path));

	await writeFile(
		page.output,
		`<!DOCTYPE html>
		<html lang="en" dir="ltr">
		<head>
			<meta charset="UTF-8">
			<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
      <link rel="shortcut icon" href="/favicon.ico"/>
			<title>${page.name} | Sphido Example</title>
		</head>
		<body class="prose mx-auto my-6">${page.content}</body>
		<!-- Generated by Sphido from ${page.path} -->
		</html>
	`,
	);

	await copyFile("content/favicon.ico", "public/favicon.ico");
}
