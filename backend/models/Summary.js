const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  articleUrl: String,
  articleTitle: String,
  summary: {
    type: String,
    required: true
  },
  keyPoints: [String],
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  readingTime: Number,
  provider: {
    type: String,
    enum: ['gemini', 'openai', 'mock'],
    default: 'gemini'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

module.exports = mongoose.model('Summary', summarySchema);
