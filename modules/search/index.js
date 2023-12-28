const SearchFacetsService = require('../../services/search-facets.service');

const { INDEX_NAME } = require('../utils/constant');
const ES = require('./../elasticsearch');

const parseResult = (result) => {
	const abstract = result.highlight?.abstract.join('\n');

	return { ...result._source, abstract: abstract };
}

const parseFacets = (aggregations = {}) => {
	const entries = Object.entries(aggregations) || [];

	return entries.reduce((facets, [key, obj]) => {
		facets[key] = obj.facetResult.buckets.map(bucket => ({
			value: bucket.key,
			count: bucket.doc_count,
		}));

		return facets;
	}, {});
};

const getSortField = (sortType) => {
	switch (sortType) {
		case 'DATE':
			return 'date';
		case 'RELEVANCE_SCORE':
			return '_score';
		default:
			return '_score';
	}
}
/**
 * 
 * @param {Object} payload 
 * @param {string} payload.search
 * @param {number} payload.page 
 * @param {number} payload.pageSize
 * @param {string} payload.sortBy
 * @param {searchNamespace.Search.IFacets} payload.facets
 */
const search = (payload) => {
	let must = [];
	const from = (payload.page - 1) * (payload.pageSize);
	const facetService = new SearchFacetsService(payload.facets);
	const postFilterTermsQueries = facetService.buildPostFilterQuery();
	const filterTermsQueries = facetService.buildFilterQuery();
	const aggregationQuery = facetService.buildAggregationQuery();
	const highlightConfig = facetService.getHighlightConfig();
	const sort = getSortField(payload.sortBy);

	if (payload.search) {
		must.push(({
			query_string: {
				query: payload.search,
				fields: ['abstract', 'title']
			}
		}));
	}

	if (filterTermsQueries.length) {
		must = must.concat(filterTermsQueries);
	}

	return ES.search({
		index: INDEX_NAME,
		track_total_hits: true,
		size: payload.pageSize,
		_source: { exclude: ['abstract'] },
		from,
		query: {
			bool: {
				must: must
			},
		},
		highlight: {
			...highlightConfig,
			fields: { abstract: {} }
		},
		aggs: aggregationQuery,
		post_filter: { bool: { must: postFilterTermsQueries } },
		sort: [{ [sort]: 'desc' }]
	}).then(response => {
		const unparsedResults = response.hits.hits || [];
		const total = response.hits.total.value || 0;
		const result = unparsedResults.map(parseResult);
		const facets = parseFacets(response.aggregations);

		return {
			page: payload.page,
			pageSize: payload.pageSize,
			total,
			facets,
			result
		};
	})
};

module.exports = {
	search
};