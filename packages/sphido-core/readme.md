# @sphido/core

## Install

```bash
yarn add @sphido/core
```

## Example

```js
const globby = require('globby');
const {getPages} = require('@sphido/core');

(async () => {

  const pages = await getPages(
    await globby('content/**/*.{md,html}')
  );

})();
```