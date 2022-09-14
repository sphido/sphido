# @sphido/hashtags

Search Markdown for hashtags and replaces them with a links `[#hashtag](/tag/hashtag)` code.

## Install

```bash
yarn add @sphido/hashtags
```

## API

### `getHashtags(content)`

Function `getHashtags()` searches the string for all hashtags and returns them as an array.
The input `content` parameter is expected in Markdown format, function automatically skips
preformatted text in Markdown syntax.

```javascript
import {getHashtags} from '@sphido/hashtags';

const tags = getHashtags('#one #two #three `color: #red`');
console.log(tags); // will be ['#one', '#two', '#three']; 
```

### `tagsToMarkdown(content, tags = [], options?)`

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

### `hashtags(page, dirent)`

Function `hashtags()` search for all hashtags in `page.content`.
In case that `page.content` property is empty, function will load file
content automatically. All found tags are then stored in a `page.tags`
property as an array. Function will also automatically replace hashtags to
Markdown syntax for links `[#hash](/tag/hash)`.

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