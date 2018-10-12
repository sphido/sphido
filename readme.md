
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

See `example` folder for more examples.

## License

MIT