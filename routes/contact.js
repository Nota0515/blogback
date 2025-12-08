const express = require('express');
const Router = express.Router();
const { handleContactForm } = require('../controllers/contactController');

Router.post('/', handleContactForm);

module.exports = Router;
