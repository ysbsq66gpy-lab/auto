require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML/CSS)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Zapier Trigger Endpoint
app.post('/trigger-zap', async (req, res) => {
    const ZAP_HOOK_URL = process.env.ZAP_HOOK_URL || 'https://hooks.zapier.com/hooks/platform/API_ID/TRIGGER_KEY';

    console.log('🚀 Web request received to trigger Zap...');

    try {
        const response = await axios.post(ZAP_HOOK_URL, {
            topic: req.body.topic,
            tone: req.body.tone,
            target: req.body.target,
            full_prompt: `주제: ${req.body.topic}, 말투: ${req.body.tone}, 타겟: ${req.body.target}`,
            timestamp: new Date().toISOString()
        });

        console.log('✅ Zap triggered successfully via Web!');
        res.status(200).json({
            success: true,
            message: 'Zap triggered successfully!',
            zapResponse: response.status
        });
    } catch (error) {
        console.error('❌ Error triggering Zap:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`\n✨ Server is running on http://localhost:${PORT}`);
    console.log(`📡 Ready to trigger Zapier hooks!\n`);
});
