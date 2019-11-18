
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

```js
const globby = require('globby');
const {join} = require('path');

const Sphido = require('@sphido/core');
const SphidoExtenders = [
    require('@sphido/frontmatter'),
    require('@sphido/marked'),
    page => {
      page.out = join(page.dir.replace('content', 'public'), page.slug, 'index.html')
    }
];


(async () => {

  // get list of pages...
  const pages = await Sphido.getPages(
  		await globby('content/**/*.{md,html}'), 
		...SphidoExtenders
	);

  for await (const page of pages) {
    // save page to HTML (with default theme/page.html)
    // from content ===> public directory
    await Sphido.save(

    )

    save(`<html>${page.title}${page.content}</html>`)


  }
  
})();
```


## Examples

* [Basic example](https://github.com/sphido/examples/tree/master/examples/basic)
* [Custom extenders](https://github.com/sphido/examples/tree/master/examples/custom-extenders)
* [RSS](https://github.com/sphido/examples/tree/master/examples/rss)
* [Sitemap](https://github.com/sphido/examples/tree/master/examples/sitemap)

## License

MIT