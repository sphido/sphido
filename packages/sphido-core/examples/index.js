#!/usr/bin/env node

import {getPages, listPages, fromFile, toFile} from '@sphido/core';
import {dirname, relative} from 'node:path';
import {join} from 'node:path';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';

function getHtml() {
	return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>${this.name}</title>	
</head>
<body>${this.content}</body>
<!-- Generated with Sphido from ${this.path} -->
</html>`;
}

const pages = await getPages({path: 'content'}, {getHtml});

for (const page of listPages(pages)) {
	page.content = marked(await fromFile(page.path));
	page.output = join('public', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	await toFile(page.output, page.getHtml());
}