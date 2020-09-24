# @sphido/marked

**DEPRECATED**: Please use [`@sphido/markdown`](https://www.npmjs.com/package/@sphido/markdown) instead.

## Install

```bash
yarn add @sphido/marked
```

## Example

```javascript
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
## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-marked
