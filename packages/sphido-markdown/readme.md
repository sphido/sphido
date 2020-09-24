# @sphido/markdown

Sphido page extender that transform `page.content` markdown to HTML with [marked](https://marked.js.org/).

## Install

```bash
yarn add @sphido/markdown
```

## Example

```javascript
const globby = require('globby');
const Sphido = require('@sphido/core');
const {markdown, renderer} = require('@sphido/markdown');
 
// @see https://marked.js.org/using_pro#renderer

renderer({
  table: (header, body)  => `<table class="table table-bordered table-striped bg-white m-1">${header}${body}</table>`
});

(async () => {

  const pages = await Sphido.getPages(
    await globby('content/**/*.{md,html}'),
    markdown
  );

})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-markdown