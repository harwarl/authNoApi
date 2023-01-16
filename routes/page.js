const pageController = require('../controllers/pages');
const express = require('express');
const router = express.Router();

router.get('/', pageController.getIndex);

module.exports = router;