# Sphido

A rocket 🚀 fast, lightweight, static site generator.

## Install

```
$ npm install sphido
```

## Usage

```
const globby = require('globby');
const Sphido = require('../../src/index');

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

## Default page properties

## TODO

- add cli.js 
- customize numjucks settings