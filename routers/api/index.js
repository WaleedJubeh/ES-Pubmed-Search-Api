const router = require('express').Router();
const searchRouter = require('./articles');

router.use('/articles', searchRouter);

module.exports = router;
