# @sphido/pagination

## Install

```bash
yarn add @sphido/pagination
```

## Usage

```js
const pagination = require('@sphido/pagination');

const posts = [
  {title: 'First title'},
  {title: 'Second title'},
  {title: 'Another title'},
  {title: 'And last one'}
];

(async () => {
  const pages = pagination(posts, 3);
  for await (const page of pages) {
	console.log(page.posts); // list of posts on current page
	console.log(page.current); // current page no
	console.log(page.pages); // array of other pages
  }
})();
```

Pagination can be easily combine with [@sphido/nunjucks](https://github.com/sphido/sphido/tree/master/packages/sphido-nunjucks) package: 

```js
const pagination = require('@sphido/pagination');
const {renderToFile} = require('@sphido/nunjucks');

(async () => {
  const posts = await getPages(
	await globby('content/**/*.{md,html}'),
	...[
	  require('@sphido/frontmatter'),
	  require('@sphido/marked'),
	  require('@sphido/meta'),
	]
  );
  

  for await (const page of pagination(posts, 8)) {
	await renderToFile(
	  page.current === 1 ? 'public/index.html' : join('public/page/', page.current.toString(), 'index.html'),
	  'theme/pages.html',
	  {page}
	);
  }
})();
```


Example of `theme/pages.html` template:

```html
<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
  <title>
	{% if page.current > 1 %}
	page {{page.current}} of {{page.pages.length}}
	{% endif %}
</title>
</head>
<body>

<main>
  {% for post in page.posts %}
  <article class="{{post.slug}}">
	<h2>{{post.title}}</h2>
	<p>{{ post.content | striptags | truncate(380) }}</p>
  </article>
  {% endfor %}
</main>

<!-- list of other pages-->
<footer>
  {% if page.pages %}
  <nav>
	<ul class="pagination justify-content-center d-flex flex-wrap">
	  {% for pageNumber in page.pages %}
	  <li class="page-item my-2 {{'active' if pageNumber === page.current}}">
		<a class="page-link" href="/{{'page/' + pageNumber if pageNumber > 1 }}">{{pageNumber}}</a>
	  </li>
	  {% endfor %}
	</ul>
  </nav>
  {% endif %}
</footer>

</body>
</html>
```