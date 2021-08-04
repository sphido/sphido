import test from 'ava';
import {pagination} from '../lib/pagination.js';

const posts = [
	{title: 'first'},
	{title: 'second'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one'},
	{title: 'another one', content: 'content'},
];

test('first page', async t => {
	const pages = await pagination(posts, 1);
	const firstPage = await pages.next();
	t.deepEqual(firstPage.value.pages, [1, 2, 3, 4, 5, 6, 7, 8]);
	t.is(firstPage.value.current, 1);
	t.is(firstPage.value.posts.length, 1);
	t.is(firstPage.value.posts[0].title, 'first');
});

test('second page', async t => {
	const pages = await pagination(posts, 1);
	const firstPage = await pages.next();
	t.deepEqual(firstPage.value.pages, [1, 2, 3, 4, 5, 6, 7, 8]);
	t.is(firstPage.value.current, 1);
	const secondPage = await pages.next();
	t.is(secondPage.value.current, 2);
	t.is(secondPage.value.posts.length, 1);
	t.is(secondPage.value.posts[0].title, 'second');
});

test('default parPage value', async t => {
	const pages = pagination(posts);

	// First page
	const firstPage = await pages.next();
	t.deepEqual(firstPage.value.pages, [1, 2]); // Total pages count
	t.is(firstPage.value.posts.length, 5);
	t.is(firstPage.value.posts[0].title, 'first');
	t.is(firstPage.value.posts[1].title, 'second');
	t.is(firstPage.value.posts[2].title, 'another one');
	t.is(firstPage.value.posts[3].title, 'another one');
	t.is(firstPage.value.posts[4].title, 'another one');

	// Second page
	const secondPage = await pages.next();
	t.deepEqual(secondPage.value.pages, [1, 2]); // Total pages count
	t.is(secondPage.value.current, 2);
	t.is(secondPage.value.posts.length, 3);
	t.is(secondPage.value.posts[0].title, 'another one');
	t.is(secondPage.value.posts[1].title, 'another one');
	t.is(secondPage.value.posts[2].title, 'another one');
});

test('pagination over posts', async t => {
	const pages = await pagination(posts, 3);
	for await (const page of pages) {
		t.is(page.current > 0, true); // 1, 2, 3, 4
		t.is(page.posts.length >= 2, true); // 3, 3, 2 posts per page
	}
});

test('empty posts', async t => {
	const pages = await pagination([], 3);

	for await (const page of pages) {
		t.is(typeof page === 'object', true);
		t.fail('This page should not exists...');
	}

	t.pass();
});
