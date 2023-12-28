const INDEX_NAME = 'articles';
const SNIPPET_SIZE = 250;
const SNIPPETS_COUNT = 3;

const FIELD_FILTER_ALIASES = {
	journals: 'journalTitle',
	languages: 'language.keyword',
	authors: 'authors'
};

module.exports = {
	INDEX_NAME,
	FIELD_FILTER_ALIASES,
	SNIPPET_SIZE,
	SNIPPETS_COUNT
}