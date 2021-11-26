import {marked} from 'marked';

export const markdown = page => {
	page.content = page.ext === '.html' ? page.content : marked(page.content);
};

export const options = options => {
	marked.setOptions(options);
};

export const renderer = renderer => {
	marked.use({renderer});
};

export const tokenizer = tokenizer => {
	marked.use({tokenizer});
};

export {marked};
