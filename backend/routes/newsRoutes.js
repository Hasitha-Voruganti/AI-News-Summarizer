const express = require('express');
const { getHeadlines, searchNews, getCategories } = require('../controllers/newsController');

const router = express.Router();

router.get('/headlines', getHeadlines);
router.get('/search', searchNews);
router.get('/categories', getCategories);

module.exports = router;
