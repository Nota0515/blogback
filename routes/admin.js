const { auth } = require('../middleware/auth');
const { postblog , deleteblog , updateblog } = require('../controllers/admincontroller.')
const express = require('express');
const router = express.Router();

router.post('/blog/v1/new' , auth , postblog );
router.delete('/blog/:slug' , auth , deleteblog );
router.patch('/blog/:slug' , auth , updateblog );

module.exports = router;