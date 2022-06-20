# @sphido/hashtags

Find hashtags and replaces them with a link code `[#hashtag](/tag/hashtag)`

## Install

```bash
yarn add @sphido/hashtags
```

```javascript
import {getPages, listPages, fromFile} from '@sphido/core';
import {getHashtags, tagsToLinks} from '@sphido/hashtags';
import {marked} from 'marked';
const pages = await getPages({path: 'content'});

for (const page of listPages(pages)) {
	page.content = fromFile(page.path);
	page.tags = getHashtags(content);
	page.tags = tagsToLinks(page.content, page.tags);
	
	
}
```

## Source codes

https://github.com/sphido/sphido/tree/main/packages/sphido-hashtags