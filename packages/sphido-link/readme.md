# @sphido/link


## Install

```bash
yarn add @sphido/link
```

## Example

```js
const globby = require('globby');
const Sphido = require('@sphido/core');
const SphidoLink = require('@sphido/link');

(async () => {

  const page = await Sphido.getPage(    __dirname + '/example.html', SphidoLink);
  console.log(page.link());

})();
```