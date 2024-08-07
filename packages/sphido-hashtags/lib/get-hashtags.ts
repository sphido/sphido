/** * Return hashtags array from string */
export function getHashtags(content: string): RegExpMatchArray {
	return content
		.replace(/`{1,3}[^`]*`{1,3}/gim, "") // Skip code
		.match(/(?<=^|\s)#([\w-]{2,})/gim); // Match all tags
}
