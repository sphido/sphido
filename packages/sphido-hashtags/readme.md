# @sphido/hashtags

Search hashtags and replaces them with a link `[#hashtag](/tag/hashtag)` code.

## Install

```bash
yarn add @sphido/hashtags
```

## Functions

### function `getHashtags(content)`

Function `getHashtags()` searches the string for all hashtags and returns them as an array.
The input `content` parameter is expected in Markdown format, function automatically skips
preformatted text in Markdown syntax.

```javascript
import {getHashtags} from '@sphido/hashtags';

const tags = getHashtags('#one #two #three `color: #red`');
console.log(tags); // will be ['#one', '#two', '#three']; 
```

### function `tagsToMarkdown(content, tags = [], options = {})`

Function `tagsToMarkdown()` expect at last two parameters on the input - `content` and `tags`
Replace hashtags with Markdown syntax for links `[#hash](/tag/hash)`

```javascript
import {getPages, allPages, readFile} from '@sphido/core';
import {getHashtags, tagsToMarkdown} from '@sphido/hashtags';

const pages = await getPages({path: 'content'});

for (const page of allPages(pages)) {
	page.content = await readFile(page.path);
	page.tags = getHashtags(page.content);

	// 
	page.content = tagsToMarkdown(page.content, page.tags);
}
```

### function `hashtags()`

Function `hashtags()` is a Sphido extender. That extender will be load `page.content` automatically
and add `page.tags` property to the `page` object and replace all hashtags with Markdown links. 

```javascript
import {getPages, allPages} from '@sphido/core';
import {hashtags} from '@sphido/hashtags';

const pages = await getPages({path: 'content'}, hashtags);

for (const page of allPages(pages)) {
	console.log(page.tags, page.content);
}
```

## Source codes

[@sphido/hashtags](https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags)