const express = require('express');
const router = express.Router();
const { viewblogs , sblog } = require('../controllers/blogcontroller');

router.get('/' , viewblogs );

router.get('/:slug', sblog );

module.exports = router ;