import test from 'ava';

const {getPage} = require('../src/index');

test('RSS basics', t => {
	let page = getPage(__dirname + '/page.md');

	console.log(page);
	t.pass();
});