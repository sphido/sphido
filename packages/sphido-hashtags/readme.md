# @sphido/hashtags

Search hashtags and replaces them with a link `[#hashtag](/tag/hashtag)` code.

## Install

```bash
yarn add @sphido/hashtags
```

```javascript
import {getPages, allPages, fromFile} from '@sphido/core';
import {getHashtags, tagsToMarkdown} from '@sphido/hashtags';
import {marked} from 'marked';

const pages = await getPages({path: 'content'});

for (const page of allPages(pages)) {
	page.content = fromFile(page.path);
	page.tags = getHashtags(content);
	page.content = tagsToMarkdown(page.content, page.tags);
}
```

You can also use `hashtags()` extender, that will be load `page.content` automatically:

```javascript
import {getPages, allPages, fromFile} from '@sphido/core';
import {hashtags} from '@sphido/hashtags';
import {marked} from 'marked';

const pages = await getPages({path: 'content'}, hashtags);

for (const page of allPages(pages)) {
	console.log(page)
}
```

## Source codes

[@sphido/hashtags](https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags)