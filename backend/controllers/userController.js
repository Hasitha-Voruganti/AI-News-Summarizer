const User = require('../models/User');

// @desc    Get user bookmarks
// @route   GET /api/user/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('bookmarks');
    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Add bookmark
// @route   POST /api/user/bookmarks
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { articleId, title, description, url, urlToImage, source, publishedAt, category } = req.body;

    if (!articleId) {
      return res.status(400).json({ success: false, message: 'Article ID is required' });
    }

    const user = await User.findById(req.user._id);

    const alreadyBookmarked = user.bookmarks.find(b => b.articleId === articleId);
    if (alreadyBookmarked) {
      return res.status(400).json({ success: false, message: 'Article already bookmarked' });
    }

    if (user.bookmarks.length >= 100) {
      return res.status(400).json({ success: false, message: 'Bookmark limit (100) reached' });
    }

    user.bookmarks.unshift({ articleId, title, description, url, urlToImage, source, publishedAt, category });
    await user.save();

    res.json({ success: true, message: 'Bookmarked successfully', bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/user/bookmarks/:articleId
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.bookmarks = user.bookmarks.filter(b => b.articleId !== req.params.articleId);
    await user.save();
    res.json({ success: true, message: 'Bookmark removed', bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reading history
// @route   GET /api/user/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('readingHistory');
    res.json({ success: true, history: user.readingHistory });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to reading history
// @route   POST /api/user/history
// @access  Private
const addToHistory = async (req, res, next) => {
  try {
    const { articleId, title, url, urlToImage, source } = req.body;

    if (!articleId) {
      return res.status(400).json({ success: false, message: 'Article ID is required' });
    }

    const user = await User.findById(req.user._id);
    user.addToHistory({ articleId, title, url, urlToImage, source });
    await user.save();

    res.json({ success: true, message: 'Added to history' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear reading history
// @route   DELETE /api/user/history
// @access  Private
const clearHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.readingHistory = [];
    await user.save();
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/user/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('bookmarks readingHistory createdAt');
    res.json({
      success: true,
      stats: {
        bookmarksCount: user.bookmarks.length,
        articlesRead: user.readingHistory.length,
        memberSince: user.createdAt,
        categories: [...new Set(user.bookmarks.map(b => b.category).filter(Boolean))]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark, getHistory, addToHistory, clearHistory, getUserStats };
