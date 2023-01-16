const express = require('express');
const router = express.Router();
const is_auth = require('../middleware/is_auth').is_auth;
const pageController = require('../controllers/pages');

router.get('/', is_auth, pageController.getIndex);

module.exports = router;