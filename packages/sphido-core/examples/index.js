#!/usr/bin/env node

import {dirname, relative, join} from 'node:path';
import {getPages, allPages, readFile, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';

function getHtml({name, content, path}) {
	return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<script src="https://cdn.tailwindcss.com?plugins=typography"></script>
	<title>${name} | Sphido Example page</title>	
</head>
<body class="prose mx-auto my-6">${content}</body>
<!-- Generated with Sphido from ${path} -->
</html>`;
}

const pages = await getPages({path: 'content'});

for (const page of allPages(pages)) {
	page.output = join('public', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	page.content = marked(await readFile(page.path));
	await writeFile(page.output, getHtml(page));
}
