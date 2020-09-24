# @sphido/core

Core contains most important [`getPage()`](https://github.com/sphido/sphido/blob/master/packages/sphido-core/lib/get-page.js) 
and [`getPages()`](https://github.com/sphido/sphido/blob/master/packages/sphido-core/lib/get-page.js) functions.

* `getPage(file, [...extenders])` - returns a `page` object generated from file.
* `getPages(files, [...extenders])` - returns array of `page` objects from list of files. 

Basic page object looks like bellow:

```json
{
  "file":"path to the file",
  "dir": " directory to the file",
  "base" : "file basename without extension",
  "content": "content of file"
}
```

Pages are merged inside `getPage()` function together with `extenders`. Extender can be `object` or `function`.    


## Install

```bash
yarn add @sphido/core
```

## Example

```javascript
const globby = require('globby');
const {getPages} = require('@sphido/core');

(async () => {

  const pages = await getPages(
    await globby('content/**/*.{md,html}')
  );
})();
```

## Source codes

https://github.com/sphido/sphido/tree/master/packages/sphido-core