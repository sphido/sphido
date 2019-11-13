# @sphido/marked

## Install

```bash
yarn add @sphido/marked
```

## Example

```js
const globby = require('globby');
const Sphido = require('@sphido/core');
const marked = require('@sphido/marked');

(async () => {

  const pages = await Sphido.getPages(
    await globby('content/**/*.{md,html}'),
    marked
  );

})();
```