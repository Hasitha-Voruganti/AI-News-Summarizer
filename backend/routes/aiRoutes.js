const express = require('express');
const { summarizeArticle } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/summarize', protect, summarizeArticle);

module.exports = router;
