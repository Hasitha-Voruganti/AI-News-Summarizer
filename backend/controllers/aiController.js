const Summary = require('../models/Summary');

// @desc    Generate AI summary for an article
// @route   POST /api/ai/summarize
// @access  Private
const summarizeArticle = async (req, res, next) => {
  try {
    const { articleId, title, content, description, url } = req.body;

    if (!articleId || (!content && !description)) {
      return res.status(400).json({ success: false, message: 'Article ID and content/description are required' });
    }

    // Check cache first
    const cached = await Summary.findOne({ articleId });
    if (cached) {
      return res.json({ success: true, summary: cached, cached: true });
    }

    const textToSummarize = content || description || title;
    const provider = process.env.AI_PROVIDER || 'gemini';

    let summaryData;

    try {
      if (provider === 'openai' && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        summaryData = await summarizeWithOpenAI(title, textToSummarize);
      } else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
        summaryData = await summarizeWithGemini(title, textToSummarize);
      } else {
        summaryData = generateMockSummary(title, textToSummarize);
        summaryData.provider = 'mock';
      }
    } catch (aiError) {
      console.error('AI API Error:', aiError.message);
      summaryData = generateMockSummary(title, textToSummarize);
      summaryData.provider = 'mock';
    }

    // Cache the summary
    const summary = await Summary.create({
      articleId,
      articleUrl: url,
      articleTitle: title,
      ...summaryData
    });

    res.json({ success: true, summary, cached: false });
  } catch (error) {
    next(error);
  }
};

// Gemini AI summarization
const summarizeWithGemini = async (title, content) => {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = buildPrompt(title, content);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return parseAIResponse(text, 'gemini');
};

// OpenAI summarization
const summarizeWithOpenAI = async (title, content) => {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = buildPrompt(title, content);
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a professional news analyst. Always respond in valid JSON format as specified.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 800
  });

  const text = completion.choices[0].message.content;
  return parseAIResponse(text, 'openai');
};

const buildPrompt = (title, content) => {
  return `Analyze this news article and respond with ONLY a valid JSON object (no markdown, no explanation):

Title: "${title}"
Content: "${content.slice(0, 2000)}"

Respond with this exact JSON structure:
{
  "summary": "A clear, concise 2-3 sentence summary of the article",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "sentiment": "positive or negative or neutral",
  "readingTime": 3
}`;
};

const parseAIResponse = (text, provider) => {
  try {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      summary: parsed.summary || 'Summary not available.',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.slice(0, 5) : [],
      sentiment: ['positive', 'negative', 'neutral'].includes(parsed.sentiment) ? parsed.sentiment : 'neutral',
      readingTime: typeof parsed.readingTime === 'number' ? parsed.readingTime : 3,
      provider
    };
  } catch (e) {
    return generateMockSummary('', text, provider);
  }
};

const generateMockSummary = (title, content, provider = 'mock') => {
  const words = content.split(' ').length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const sentiments = ['positive', 'neutral', 'negative'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

  return {
    summary: `This article discusses ${title || 'recent developments'}. The content covers key aspects of the topic with relevant details and context. The piece provides an overview of the current situation and its potential implications.`,
    keyPoints: [
      'Key developments are outlined with supporting evidence and expert perspectives',
      'Multiple stakeholders and their positions are addressed throughout the piece',
      'Future implications and potential outcomes are discussed in detail',
      'Statistical data and research findings support the main arguments presented'
    ],
    sentiment,
    readingTime,
    provider
  };
};

module.exports = { summarizeArticle };
