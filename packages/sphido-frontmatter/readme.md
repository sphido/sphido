# @sphido/frontmatter

## Install

```bash
yarn add @sphido/frontmatter
```

## Example

```js
const globby = require('globby');
const Sphido = require('@sphido/core');
const frontmatter = require('@sphido/frontmatter');

(async () => {

  const pages = await Sphido.getPages(
    await globby('content/**/*.{md,html}'),
    frontmatter
  );

})();
```