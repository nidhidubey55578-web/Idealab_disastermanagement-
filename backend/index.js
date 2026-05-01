require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 5000;

// ── Supabase ─────────────────────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️  Supabase URL or Service Key is missing in backend/.env");
}
const supabase = createClient(
  supabaseUrl  || "https://placeholder.supabase.co",
  supabaseKey  || "placeholder"
);

// ── Google Gemini ─────────────────────────────────────────────────────────────
let genai = null;
if (process.env.GEMINI_API_KEY) {
  genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Google Gemini AI initialised");
} else {
  console.warn("⚠️  GEMINI_API_KEY is missing in .env  – verification will use mock responses");
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Disaster Verification Backend is running!' });
});

// ── Helper: call Gemini text model ────────────────────────────────────────────
async function callGeminiText(prompt) {
  const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ── Helper: call Gemini vision model ─────────────────────────────────────────
async function callGeminiVision(prompt, imageBase64, mimeType) {
  const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const imageParts = [
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType || 'image/png'
      }
    }
  ];
  const result = await model.generateContent([prompt, ...imageParts]);
  return result.response.text();
}

// ── Helper: parse JSON from Gemini (strips markdown fences if present) ────────
function parseGeminiJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// ── Mock fallback result ──────────────────────────────────────────────────────
function mockResult(reason) {
  return {
    status: "UNVERIFIED",
    confidence: 0,
    explanation: reason,
    sources: ["System Fallback"],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/verify-news   – verify a text claim
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/verify-news', async (req, res) => {
  const { newsText } = req.body;
  if (!newsText) return res.status(400).json({ error: "newsText is required" });
  const trimmed = newsText.trim();

  try {
    // Check cache first
    const { data: cached, error: cacheErr } = await supabase
      .from('verified_news')
      .select('*')
      .eq('news_text', trimmed)
      .maybeSingle();

    if (cacheErr) console.warn("Cache lookup error:", cacheErr.message);
    if (cached)   return res.json(cached);

    // No cache – call Gemini
    let result;
    if (!genai) {
      result = mockResult("AI Verification is unavailable – GEMINI_API_KEY not set.");
    } else {
      const prompt =
        `You are a disaster news fact-checker for India. Analyse this claim: "${trimmed}"\n` +
        `Determine if it is TRUE, FALSE, or UNVERIFIED.\n` +
        `Return ONLY valid JSON (no markdown): { "status": "TRUE"|"FALSE"|"UNVERIFIED", "confidence": 0-100, "explanation": "string", "sources": ["string"] }`;

      try {
        const raw = await callGeminiText(prompt);
        result = parseGeminiJSON(raw);
      } catch (aiErr) {
        console.error("Gemini text error:", aiErr.message);
        result = mockResult("AI verification temporarily unavailable: " + aiErr.message);
      }
    }

    const payload = {
      news_text:   trimmed,
      status:      result.status,
      confidence:  result.confidence,
      explanation: result.explanation,
      sources:     result.sources || [],
    };

    // Cache to Supabase
    try {
      const { data: saved, error: dbErr } = await supabase
        .from('verified_news')
        .insert([payload])
        .select()
        .single();
      if (dbErr) console.warn("Supabase cache error:", dbErr.message);
      return res.json(saved || payload);
    } catch (dbEx) {
      console.warn("Supabase insert failed:", dbEx.message);
      return res.json(payload);
    }
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/verify-image  – verify a screenshot / image
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/verify-image', async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "imageBase64 is required" });

  if (!genai) {
    return res.json(mockResult("AI Vision is unavailable – GEMINI_API_KEY not set."));
  }

  const validMime = (mimeType && mimeType.startsWith('image/')) ? mimeType : 'image/png';

  const prompt =
    `You are a disaster news fact-checker for India. Look at this screenshot carefully.\n` +
    `Extract any news, alert, or claim visible in the image.\n` +
    `Determine if the claim is TRUE, FALSE, or UNVERIFIED.\n` +
    `Return ONLY valid JSON (no markdown): { "status": "TRUE"|"FALSE"|"UNVERIFIED", "confidence": 0-100, "explanation": "string", "sources": ["string"] }`;

  try {
    const raw = await callGeminiVision(prompt, imageBase64, validMime);
    const result = parseGeminiJSON(raw);
    return res.json(result);
  } catch (aiErr) {
    console.error("Gemini vision error:", aiErr.message);
    return res.json(mockResult("AI Image Verification temporarily unavailable: " + aiErr.message));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/alerts         – fetch live disaster alerts
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/alerts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error("Alerts error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/report-fake    – community fake-news report
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/report-fake', async (req, res) => {
  const { newsText } = req.body;
  if (!newsText) return res.status(400).json({ error: "newsText is required" });

  try {
    const { data, error } = await supabase
      .from('reported_fake')
      .insert([{ news_text: newsText }])
      .select()
      .single();
    if (error) throw error;
    return res.json({ message: "Report submitted successfully", data });
  } catch (err) {
    console.error("Report error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
