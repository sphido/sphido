
<p align="center">
  <a href="https://sphido.org">
    <img src="https://sphido.org/img/sphido.svg" width=""/>
  </a>
</p>


<p align="center">
  A rocket 🚀 fast, lightweight, static site generator.
</p>

## Installation

```bash 
$ npm i sphido
```

## Quick Start

```javascript
const globby = require('globby');
const Sphido = require('sphido');

(async () => {

  // get list of pages...
  const pages = await Sphido.getPages(
  		await globby('content/**/*.{md,html}'), ...Sphido.extenders
	);

  for await (const page of pages) {
    // save page to HTML (with default theme/page.html)
    // from content ===> public directory
    await page.save(
        page.dir.replace('content', 'public')
    );
  }
  
})();
```


## Examples

* [Basic example](https://github.com/sphido/sphido/tree/master/examples/basic)
* [Custom extenders](https://github.com/sphido/sphido/tree/master/examples/custom-extenders)
* [RSS](https://github.com/sphido/sphido/tree/master/examples/rss)
* [Sitemap](https://github.com/sphido/sphido/tree/master/examples/sitemap)

## License

MIT