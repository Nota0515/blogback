const express = require('express');
const router = express.Router();
const { viewblogs , sblog , likedblog } = require('../controllers/blogcontroller');

router.get('/' , viewblogs );
router.get('/:slug', sblog );
router.post('/:slug/like' , likedblog )

module.exports = router ;