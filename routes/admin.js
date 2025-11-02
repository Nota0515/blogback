const protect = require('../middleware/auth');
const { postblog , deleteblog } = require('../controllers/admincontroller.')
const express = require('express');
const router = express.Router();

router.post('/blog/v1/new' , protect , postblog );
router.delete('/blog/:slug' , protect , deleteblog );

module.exports = router;