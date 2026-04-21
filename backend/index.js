require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Supabase with Service Key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase URL or Service Key is missing in backend/.env");
}

const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn("⚠️ OpenAI API Key is missing in .env");
}

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Disaster Verification Backend is running!' });
});

// Verify News Endpoint
app.post('/api/verify-news', async (req, res) => {
    const { newsText } = req.body;
    if (!newsText) return res.status(400).json({ error: "newsText is required" });

    try {
        // Check cache in verified_news table
        const { data: cached } = await supabase
            .from('verified_news')
            .select('*')
            .eq('query_text', newsText)
            .single();
        
        if (cached) return res.json(cached);

        if (!openai) return res.status(500).json({ error: "OpenAI is not configured" });

        const prompt = `Analyze the following news/alert for a disaster in India: "${newsText}". 
        Determine if it is TRUE, FALSE, or UNVERIFIED. Provide a confidence score (0-100), an explanation, and plausible sources (e.g., NDMA, IMD, PIB Fact Check).
        Return purely as JSON without markdown formatting: { "status": "TRUE" | "FALSE" | "UNVERIFIED", "confidence": number, "explanation": "string", "sources": ["string"] }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        
        const payload = {
            query_text: newsText,
            status: result.status,
            confidence: result.confidence,
            explanation: result.explanation,
            sources: result.sources || []
        };

        // Insert verified news using service key
        const { data: savedData, error } = await supabase
            .from('verified_news')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        res.json(savedData || payload);
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch Live Alerts Endpoint
app.get('/api/alerts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Alerts error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Report Fake News Endpoint
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
        res.json({ message: "Report submitted successfully", data });
    } catch (err) {
        console.error("Report error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, supabase, openai };
