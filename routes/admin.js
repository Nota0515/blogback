const protect = require('../middleware/auth');
const { postblog } = require('../controllers/admincontroller.')
const express = require('express');
const router = express.Router();

router.post('/blog/v1/new' , protect , postblog );

module.exports = router;