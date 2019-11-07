# Sphido - pagination


## Install

```bash
yarn add @sphido/pagination
```

## Usage

```js
const SphidoPagination = require('@sphido/pagination');

const posts = [
    {title: 'First title'},
    {title: 'Second title'},
    {title: 'Another title'},
    {title: 'And last one'}
];

(async () => {
    const pages = SphidoPagination(posts, 3);
    for await (const page of pages) {
      console.log(page.posts); // list of posts on current page
      console.log(page.current); // current page no
      console.log(page.pages); // array of other pages
    }
})();
```