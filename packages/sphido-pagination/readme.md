# @sphido/pagination

Allow paginate over pages return follow structure: 

```json
{
  "posts": [ "... array of pages" ],
  "current": "number of current page",
  "pages": ["... array of other pages"]
}
```

## Install

```bash
yarn add @sphido/pagination
```

## Usage

```javascript
import {pagination} from "@sphido/pagination";

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

## Source codes

https://github.com/sphido/sphido/tree/main/packages/sphido-pagination