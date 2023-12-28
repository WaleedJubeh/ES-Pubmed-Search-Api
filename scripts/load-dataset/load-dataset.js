const { INDEX_NAME } = require('../../modules/utils/constant');
const ES = require('./../../modules/elasticsearch');
const fs = require('fs');

/**
 * 
 * @param {Array} array 
 * @param {number} batchSize 
 */
const batchify = (array, batchSize = 20) => {
	const batches = [];
	for (let i = 0; i < array.length; i += batchSize) {
		const batch = array.slice(i, i + batchSize);
		batches.push(batch);
	}

	return batches;
}

const loadArticlesFromFile = (filePath) => {
	const documentsStr = fs.readFileSync(filePath);
	const documents = JSON.parse(documentsStr);
	return documents;
}

const loadData = async () => {
	const files = fs.readdirSync(__dirname + '/data/', { encoding: 'utf8' });
	for (const file of files) {
		const articles = loadArticlesFromFile(__dirname + `/data/${file}`);
		await insertArticles(articles);
	}
}

const insertArticles = async (articles) => {
	const batches = batchify(articles, 50);
	let i = 0;
	for (const batch of batches) {
		i++;
		console.info(`Batch ${i} from ${batches.length}`)
		await ES.helpers.bulk({
			index: INDEX_NAME,
			datasource: batch,
			refreshOnCompletion: false,
			onDocument: (doc) => {
				return {
					index: { _index: INDEX_NAME, _id: doc.id },
					doc
				};
			},
			onDrop: (doc) => {
				console.error('Document insert step:', JSON.stringify(doc.error), 'Error loading the document');
			}
		});
	}
}

loadData().then();