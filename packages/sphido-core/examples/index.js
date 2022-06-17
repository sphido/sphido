#!/usr/bin/env node

import {getPages, toFile, listPages, fromFile} from '@sphido/core';
import {dirname, relative} from 'node:path';
import {join} from 'node:path';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';

function getHtml({name, path, content}) {
	return `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<title>${name}</title>	
</head>
<body>${content}</body>
<!-- Generated with Sphido from ${path} -->
</html>`;
}

const pages = await getPages({path: 'content'});

for (const page of listPages(pages)) {
	const content = marked(await fromFile(page.path));
	const outputFile = join('public', relative('content', dirname(page.path)), slugify(page.name) + '.html');
	await toFile(outputFile, getHtml({...page, content}));
}