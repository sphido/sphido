# Sphido

<p align="center">
  <a href="https://sphido.org">
    <img src="https://sphido.org/img/sphido.svg" />
  </a>
</p>


<p align="center">
  A rocket 🚀 fast, lightweight, static site generator.
</p>

## Install

```
$ npm install sphido
```

## Usage

```javascript
const globby = require('globby');
const Sphido = require('sphido');

(async () => {

  // get list of pages...
  const pages = await Sphido.getPages(await globby('content/**/*.{md,html}'), ...Sphido.extenders);

  for await (const page of pages) {
    // save page to HTML (with default template/single.html)
    // from content ===> public directory
    await page.save(
        page.dir.replace('content', 'public')
    );
  }
  
})();
```

See `example` folder for more examples.

## TODO

- add cli.js 
- customize numjucks settings