const config = require('./../../config');
const elasticsearch = require('@elastic/elasticsearch');

const ES_CLIENT = new elasticsearch.Client({
    node: `${config.ES_PROTOCOL}://${config.ES_HOST}`,
    tls: { rejectUnauthorized: false },
    auth: {
        username: config.ES_USERNAME,
        password: config.ES_PASSWORD
    }
});

module.exports = ES_CLIENT;