const router = require('express').Router();
const controller = require('../../../controllers/search');

router.post('/search', controller.search);

module.exports = router;