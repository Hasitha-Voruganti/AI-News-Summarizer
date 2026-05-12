const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  preferences: {
    categories: {
      type: [String],
      default: ['general', 'technology', 'business']
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  },
  bookmarks: [{
    articleId: { type: String, required: true },
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    source: String,
    publishedAt: String,
    category: String,
    savedAt: { type: Date, default: Date.now }
  }],
  readingHistory: [{
    articleId: { type: String, required: true },
    title: String,
    url: String,
    urlToImage: String,
    source: String,
    readAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Limit reading history to 50 items
userSchema.methods.addToHistory = function(article) {
  const exists = this.readingHistory.find(h => h.articleId === article.articleId);
  if (!exists) {
    this.readingHistory.unshift(article);
    if (this.readingHistory.length > 50) {
      this.readingHistory = this.readingHistory.slice(0, 50);
    }
  }
};

module.exports = mongoose.model('User', userSchema);
