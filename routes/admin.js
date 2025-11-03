const { auth } = require('../middleware/auth');
const { postblog , deleteblog } = require('../controllers/admincontroller.')
const express = require('express');
const router = express.Router();

router.post('/blog/v1/new' , auth , postblog );
router.delete('/blog/:slug' , auth , deleteblog );

module.exports = router;