# @sphido/markdown

Sphido page extender that transform `page.content` markdown to HTML with [marked](https://marked.js.org/).

## Install

```bash
yarn add @sphido/markdown
```

## Example

```javascript
import globby from 'globby';
import {getPages} from '@sphido/core';
import {markdown, renderer} from '@sphido/markdown';
 
// @see https://marked.js.org/using_pro#renderer

renderer({
  table: (header, body)  => `<table class="table table-bordered table-striped bg-white m-1">${header}${body}</table>`
});

(async () => {

  const pages = await getPages(
    await globby('content/**/*.{md,html}'),
    markdown
  );

})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-markdown