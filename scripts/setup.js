#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../backend/.env');
const envExamplePath = path.join(__dirname, '../backend/.env.example');

if (!fs.existsSync(envPath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created backend/.env from .env.example');
  console.log('⚠️  Please edit backend/.env and add your API keys:');
  console.log('   - NEWS_API_KEY from https://newsapi.org (free)');
  console.log('   - GEMINI_API_KEY from https://aistudio.google.com (free)');
  console.log('   - Or OPENAI_API_KEY from https://platform.openai.com');
  console.log('   - MONGO_URI (default: mongodb://localhost:27017/news-summarizer)');
} else {
  console.log('ℹ️  backend/.env already exists');
}

console.log('\n🚀 Setup complete! Run: npm run dev\n');
