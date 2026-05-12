const express = require('express');
const { getBookmarks, addBookmark, removeBookmark, getHistory, addToHistory, clearHistory, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getUserStats);
router.route('/bookmarks').get(getBookmarks).post(addBookmark);
router.delete('/bookmarks/:articleId', removeBookmark);
router.route('/history').get(getHistory).post(addToHistory).delete(clearHistory);

module.exports = router;
