const axios = require('axios');

const NEWS_API_BASE = 'https://newsapi.org/v2';
const API_KEY = process.env.NEWS_API_KEY;

const CATEGORIES = ['general', 'business', 'technology', 'entertainment', 'health', 'science', 'sports'];

// Generate article ID from URL
const generateArticleId = (url) => {
  return Buffer.from(url || '').toString('base64').slice(0, 32);
};

// @desc    Get top headlines
// @route   GET /api/news/headlines
// @access  Public
const getHeadlines = async (req, res, next) => {
  try {
    const { category = 'general', country = 'us', page = 1, pageSize = 12 } = req.query;

    if (!API_KEY || API_KEY === 'your_newsapi_key_here') {
      // Return mock data if no API key
      return res.json({ success: true, ...getMockNews(category, parseInt(page), parseInt(pageSize)) });
    }

    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: { category, country, page, pageSize, apiKey: API_KEY }
    });

    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]' && a.url)
      .map(article => ({
        ...article,
        articleId: generateArticleId(article.url),
        category
      }));

    res.json({
      success: true,
      articles,
      totalResults: response.data.totalResults || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ success: false, message: 'Invalid News API key' });
    }
    if (error.response?.status === 429) {
      return res.json({ success: true, ...getMockNews(req.query.category || 'general', 1, 12), note: 'Rate limit - showing cached data' });
    }
    next(error);
  }
};

// @desc    Search articles
// @route   GET /api/news/search
// @access  Public
const searchNews = async (req, res, next) => {
  try {
    const { q, category, from, to, sortBy = 'publishedAt', page = 1, pageSize = 12 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
    }

    if (!API_KEY || API_KEY === 'your_newsapi_key_here') {
      return res.json({ success: true, ...getMockNews(category || 'general', parseInt(page), parseInt(pageSize), q) });
    }

    const params = { q, sortBy, page, pageSize, apiKey: API_KEY, language: 'en' };
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await axios.get(`${NEWS_API_BASE}/everything`, { params });

    const articles = (response.data.articles || [])
      .filter(a => a.title && a.title !== '[Removed]' && a.url)
      .map(article => ({
        ...article,
        articleId: generateArticleId(article.url),
        category: category || 'general'
      }));

    res.json({
      success: true,
      articles,
      totalResults: response.data.totalResults || 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      query: q
    });
  } catch (error) {
    if (error.response?.status === 429) {
      return res.json({ success: true, ...getMockNews('general', 1, 12, req.query.q), note: 'Rate limit reached' });
    }
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/news/categories
// @access  Public
const getCategories = async (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
};

// Mock data for when API key is not available
const getMockNews = (category = 'general', page = 1, pageSize = 12, query = '') => {
  const mockArticles = [
    {
      title: 'AI Breakthroughs Are Reshaping the Technology Landscape in 2024',
      description: 'Artificial intelligence continues to advance rapidly with new models achieving unprecedented capabilities in reasoning and multimodal understanding.',
      url: 'https://example.com/ai-breakthroughs',
      urlToImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      source: { name: 'Tech Review', id: 'tech-review' },
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      author: 'Sarah Johnson',
      content: 'Artificial intelligence systems have made remarkable progress this year, with large language models demonstrating advanced reasoning capabilities. Researchers at leading AI labs have published groundbreaking papers on emergent behaviors and alignment techniques that could pave the way for more reliable AI systems.',
      category: category || 'technology',
      articleId: 'mock-001'
    },
    {
      title: 'Global Markets Hit Record Highs Amid Positive Economic Indicators',
      description: 'Stock markets worldwide reached new records as inflation data came in lower than expected, boosting investor confidence.',
      url: 'https://example.com/markets-record',
      urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      source: { name: 'Financial Times', id: 'financial-times' },
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      author: 'Michael Chen',
      content: 'Global financial markets surged to record heights on Friday as inflation data came in below forecasts, signaling potential interest rate cuts in the coming months. The S&P 500 gained 1.8%, the Nasdaq rose 2.1%, and European indices also closed higher.',
      category: category || 'business',
      articleId: 'mock-002'
    },
    {
      title: 'Breakthrough in Quantum Computing Promises New Era of Processing Power',
      description: 'Scientists achieve 99.9% accuracy in quantum error correction, a critical milestone for practical quantum computers.',
      url: 'https://example.com/quantum-breakthrough',
      urlToImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      source: { name: 'Science Daily', id: 'science-daily' },
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      author: 'Dr. Emma Williams',
      content: 'In a landmark paper published in Nature, researchers demonstrated quantum error correction with 99.9% accuracy using a novel approach that could make fault-tolerant quantum computing achievable within the decade.',
      category: category || 'science',
      articleId: 'mock-003'
    },
    {
      title: 'New Climate Policy Framework Agreed Upon at International Summit',
      description: 'World leaders reach consensus on ambitious new targets for carbon emission reductions by 2035.',
      url: 'https://example.com/climate-policy',
      urlToImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      source: { name: 'Global News', id: 'global-news' },
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      author: 'James Rodriguez',
      content: 'Representatives from 195 countries gathered in Geneva to sign a landmark climate agreement, committing to reduce carbon emissions by 60% compared to 1990 levels by 2035. The agreement includes binding mechanisms and financial support for developing nations.',
      category: category || 'general',
      articleId: 'mock-004'
    },
    {
      title: 'Revolutionary Gene Therapy Shows Promise in Treating Rare Genetic Disorders',
      description: 'Clinical trials demonstrate 85% success rate in treating previously incurable genetic conditions using CRISPR technology.',
      url: 'https://example.com/gene-therapy',
      urlToImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      source: { name: 'Health Today', id: 'health-today' },
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      author: 'Dr. Lisa Park',
      content: 'A new CRISPR-based gene therapy has shown remarkable success in phase 3 clinical trials, with 85% of patients with sickle cell disease achieving a functional cure after a single treatment.',
      category: category || 'health',
      articleId: 'mock-005'
    },
    {
      title: 'Space Agency Confirms Discovery of Water Ice on Mars Polar Caps',
      description: 'High-resolution imaging reveals vast deposits of water ice beneath the Martian surface, opening new possibilities for future missions.',
      url: 'https://example.com/mars-water',
      urlToImage: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
      source: { name: 'Space News', id: 'space-news' },
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      author: 'Alex Thompson',
      content: 'NASA and ESA scientists have jointly confirmed the presence of substantial water ice deposits in the Martian polar regions, with new data suggesting reserves large enough to cover Mars in a 1.5-meter ocean if melted.',
      category: category || 'science',
      articleId: 'mock-006'
    },
    {
      title: 'Electric Vehicle Sales Surpass 50% Market Share for First Time in History',
      description: 'Global EV adoption hits historic milestone as charging infrastructure expands and battery costs continue to fall.',
      url: 'https://example.com/ev-sales',
      urlToImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
      source: { name: 'Auto World', id: 'auto-world' },
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      author: 'Nicole Foster',
      content: 'Electric vehicles now account for more than half of all new car sales globally, a milestone that seemed impossible just five years ago. The rapid adoption is being driven by falling battery prices, improved range, and expanding charging networks.',
      category: category || 'business',
      articleId: 'mock-007'
    },
    {
      title: 'Tech Giants Collaborate on Open Internet Standards Initiative',
      description: 'Major technology companies announce joint effort to create open, interoperable standards for the next generation of the web.',
      url: 'https://example.com/open-standards',
      urlToImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      source: { name: 'Wired', id: 'wired' },
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      author: 'Tom Bradley',
      content: 'In an unprecedented move, Apple, Google, Microsoft, and Meta have announced a joint initiative to develop open, interoperable standards for the next-generation web, aiming to prevent platform lock-in and promote digital rights.',
      category: category || 'technology',
      articleId: 'mock-008'
    },
    {
      title: 'Renewable Energy Capacity Breaks All-Time Records Globally',
      description: 'Solar and wind installations set new records in the first quarter, with investments surpassing fossil fuel spending.',
      url: 'https://example.com/renewable-records',
      urlToImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      source: { name: 'Energy Monitor', id: 'energy-monitor' },
      publishedAt: new Date(Date.now() - 32400000).toISOString(),
      author: 'Rachel Green',
      content: 'Global renewable energy capacity additions reached a record high in Q1, with solar power alone adding 120 GW of new capacity. For the first time, clean energy investments outpaced fossil fuel spending by a factor of 3 to 1.',
      category: category || 'science',
      articleId: 'mock-009'
    },
    {
      title: 'Mental Health Apps See Surge in Adoption as Awareness Grows',
      description: 'Digital mental health platforms report 200% growth as employers and schools increase access to psychological support tools.',
      url: 'https://example.com/mental-health-apps',
      urlToImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      source: { name: 'Health Tech News', id: 'health-tech' },
      publishedAt: new Date(Date.now() - 36000000).toISOString(),
      author: 'Sandra Moore',
      content: 'Mental health applications have seen explosive growth, with major platforms reporting tripling of their user bases. This surge comes alongside increasing corporate and educational investment in psychological wellbeing programs.',
      category: category || 'health',
      articleId: 'mock-010'
    },
    {
      title: 'Autonomous Delivery Robots Begin Operating in Major Cities Worldwide',
      description: 'Last-mile delivery robots receive regulatory approval in 50 cities across 20 countries, transforming urban logistics.',
      url: 'https://example.com/delivery-robots',
      urlToImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      source: { name: 'Robotics Today', id: 'robotics-today' },
      publishedAt: new Date(Date.now() - 39600000).toISOString(),
      author: 'David Kim',
      content: 'Autonomous delivery robots have begun commercial operations in dozens of major cities following regulatory approvals, with companies reporting 40% lower delivery costs and significantly reduced traffic congestion compared to traditional van deliveries.',
      category: category || 'technology',
      articleId: 'mock-011'
    },
    {
      title: 'Major Food Companies Commit to 100% Sustainable Packaging by 2026',
      description: 'Industry giants announce comprehensive plan to eliminate single-use plastics, shifting to compostable and recyclable materials.',
      url: 'https://example.com/sustainable-packaging',
      urlToImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      source: { name: 'Environment News', id: 'environment-news' },
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      author: 'Maria Santos',
      content: 'Leading food and beverage companies, including several Fortune 500 firms, have signed a commitment to transition entirely to sustainable, compostable packaging across all product lines by 2026, with interim targets set for each year.',
      category: category || 'general',
      articleId: 'mock-012'
    }
  ];

  const filtered = query
    ? mockArticles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      )
    : mockArticles;

  const startIdx = (page - 1) * pageSize;
  return {
    articles: filtered.slice(startIdx, startIdx + pageSize),
    totalResults: filtered.length,
    page,
    pageSize,
    isMockData: true
  };
};

module.exports = { getHeadlines, searchNews, getCategories };
