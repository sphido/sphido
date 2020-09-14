# @sphido/markdown

## Install

```bash
yarn add @sphido/markdown
```

## Example

```js
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