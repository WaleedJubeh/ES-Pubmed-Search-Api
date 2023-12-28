const { FIELD_FILTER_ALIASES, SNIPPET_SIZE, SNIPPETS_COUNT } = require('../modules/utils/constant');

class SearchFacetsService {
	/**
	 * @type {Search.IFacets}
	 */
	facets;
	/**
	 * @param {Search.IFacets} facets
	 */
	constructor(facets) {
		this.facets = facets || {};
		this.facetItems = [
			{ name: 'authors', field: FIELD_FILTER_ALIASES.authors },
			{ name: 'journals', field: FIELD_FILTER_ALIASES.journals },
			{ name: 'languages', field: FIELD_FILTER_ALIASES.languages }
		];
	}

	getHighlightConfig() {
		// standard highlighter
		return {
			boundary_chars: ',.!?[]<>\t\n',
			fragment_size: SNIPPET_SIZE,
			no_match_size: SNIPPET_SIZE,
			number_of_fragments: SNIPPETS_COUNT,
			pre_tags: ['<span class="search-highlight">'],
			post_tags: ['</span>'],
			require_field_match: false,
			encoder: 'html',
		}
	}
	buildPostFilterQuery() {
		// Usually post filter is built for OR facets
		/**
		 * @type {[string, Search.IValue][]}
		 */
		const entities = Object.entries(this.facets);

		return entities
			.filter(([_, facet]) => facet?.operator === 'OR' && facet?.value.length > 0)
			.map(([field, facet]) => {
				const fieldName = FIELD_FILTER_ALIASES[field] || field;
				return {
					terms: {
						[fieldName]: facet.value
					}
				};
			});
	}

	buildFilterQuery() {
		// Usually filter is built for AND facets
		/**
		 * @type {[string, searchNamespace.Search.IValue][]}
		 */
		const entities = Object.entries(this.facets);

		return entities
			.filter(([_, facet]) => facet?.operator === 'AND' && facet?.value.length > 0)
			.flatMap(([field, facet]) => {
				const fieldName = FIELD_FILTER_ALIASES[field] || field;
				return facet.value.map(value => ({
					term: {
						[fieldName]: value
					}
				}));
			});
	}

	buildAggregationQuery() {
		const facetsKeys = Object.keys(this.facets);
		const remainingFacets = this.facetItems.filter(item => !facetsKeys.includes(item.name));

		return facetsKeys
			.concat(remainingFacets.map(facet => facet.name))
			.reduce((query, field) => {
				const { [field]: facetData, ...otherFacets } = this.facets;
				const typeAhead = facetData?.typeAhead;
				query[field] = this.getAggregationQueryForField(field, otherFacets, typeAhead);
				return query;
			}, {});
	};

	getAggregationQueryForField(field, otherFacets, typeAhead) {
		const fieldName = FIELD_FILTER_ALIASES[field] || field;
		const aggregationFilter = this.buildAggregationFilterQuery(otherFacets);
		const filter = aggregationFilter.length ? { bool: { filter: aggregationFilter } } : { bool: {} };
		const typeAheadQuery = typeAhead ? { include: this.getRegexQuery(typeAhead) } : {};

		return {
			aggs: {
				facetResult: {
					terms: {
						field: fieldName,
						...typeAheadQuery
					}
				}
			},
			filter
		};
	}

	getRegexQuery(input) {
		const conformed = this.escapeRegExp(input).replace(
			/[A-Za-z]/g,
			(letter) => `[${letter.toUpperCase()}${letter.toLowerCase()}]`
		);
		const pattern = `.*${conformed}.*`;
		return pattern;
	}

	escapeRegExp(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

	buildAggregationFilterQuery(facets) {
		// Usually post filter is built for OR facets
		/**
		 * @type {[string, Search.IValue][]}
		 */
		const entities = Object.entries(facets);
		return entities
			.filter(([_, facet]) => facet?.operator === 'OR' && facet?.value.length > 0)
			.map(([field, facet]) => {
				const fieldName = FIELD_FILTER_ALIASES[field] || field;
				return {
					terms: {
						[fieldName]: facet.value
					}
				};
			});
	}
}

module.exports = SearchFacetsService;