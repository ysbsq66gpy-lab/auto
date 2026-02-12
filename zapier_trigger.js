require('dotenv').config();
const axios = require('axios');

// Zapier Credentials (Recommended to use .env)
const ZAP_API_KEY = process.env.ZAP_API_KEY || 'YOUR_ZAP_API_KEY';
const ZAP_HOOK_URL = process.env.ZAP_HOOK_URL || 'https://hooks.zapier.com/hooks/platform/API_ID/TRIGGER_KEY';

/**
 * Triggers a Zapier Webhook
 */
const triggerZap = async () => {
  console.log('🚀 Attempting to trigger Zap...');
  
  try {
    const response = await axios.post(ZAP_HOOK_URL, {
      data: 'New user registered',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Some Zapier platform hooks require an API key in the headers
        // 'X-API-KEY': ZAP_API_KEY 
      }
    });

    console.log('✅ Zap triggered successfully!');
    console.log('Response status:', response.status);
  } catch (error) {
    console.error('❌ Error triggering Zap:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   Message: ${error.message}`);
    }
  }
};

triggerZap();
