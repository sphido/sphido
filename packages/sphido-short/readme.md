# @sphido/short

## Install

```bash
yarn add @sphido/excerpt
```

## Example

```js
const globby = require('globby');
const Sphido = require('@sphido/core');
const short = require('@sphido/short');

(async () => {

  const page = await Sphido.getPage(
    __dirname + '/example.html', short
  );

  console.log(page.short());

})();
```