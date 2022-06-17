# @sphido/core

Sphido core package contains two most important function `getPages()` and `listPages()`.
The `getPages()` function scans directories for all `*.md` and `*.html` files.
Second function `listPages()` is [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
that allow to iterate over all pages.

```javascript
const pages = await getPages({path: 'content'}, /* ...exteners */);
```

Returned structure is very simple and looks like follow:

```json
[
	{
		"name": "Main page",
		"path": "content/Main page.md"
	},
	{
		"name": "Directory",
		"children": [
			{
				"name": "Subpage one",
				"path": "content/Directory/Subpage one.md"
			},
			{
				"name": "Subpage two",
				"path": "content/Directory/Subpage two.md"
			}
		]
	}
]
```

Then iterate over pages like follow:

```javascript
for (const page of listPages(pages)) {
	console.log(page);
}
```

## Extend

Every single `page` object inside structure can be modified with extender. Extenders are set as additional parameters of the `getPages()` function.
There are two types of extenders:

### *callback* extenders

Callback extender is a function that is called during recursion over each page with three
parameters passed to the function `page`, `path` and [`dirent`](https://nodejs.org/api/fs.html#class-fsdirent).

```javascript
const callbackExtender = (page, path, dirent) => {
	// do anything with page object
}

const pages = await getPages({path: 'content'}, callbackExtender);
```

### *object* extenders

This extender is just a simple JavaScript object that is combined with the `page` object using the  [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) function.

```javascript
const objectExtender = {
	author: 'Roman Ožana'
}

const pages = await getPages({path: 'content'}, objectExtender);
```

There is no limit to the number of extenders, you can combine as many as you want.
Let's have the following code:

```javascript
const extenders = [
	// callback extender will be called during iteration
	(page) => {
		// add property
		page.title = `${page.name} | my best website`;
		// or function
		page.getDate = () => new Date();
	},

	// object extender will be merged with page object
	{
		"author": "Roman Ožana",
		"getLink": function () {
			return this.path.replace('content', 'public');
		}
	}
];

const pages = getPages({path: 'content'}, ...extenders);
```

then you get this structure:

```json
[
	{
		"name": "Main page",
		"path": "content/Main page.md",
		"title": "Main page | my best website",
		"author": "Roman Ožana",
		"getDate": "<Function>",
		"getLink": "<Function>"
	}
]
```

## Installation

```bash
yarn add @sphido/core
```

## Example

Following example read all `*.md` files in `content` directory and process them with [marked](https://github.com/markedjs/marked) to HTML files

```javascript
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
```

## Source codes

https://github.com/sphido/sphido/tree/main/packages/sphido-core