# @sphido/core

## Install

```bash
yarn add @sphido/core
```

## Example

```js
const globby = require('globby');
const Sphido = require('@sphido/core');

(async () => {

  const pages = await Sphido.getPages(
    await globby('content/**/*.{md,html}')
  );

})();
```