const express = require('express');
const router = express.Router();
const graphql = require('../controllers/graphql')

router.use('/',  graphql.startGraphQL);

module.exports = router;
