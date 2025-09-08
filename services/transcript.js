const axios = require("axios");

async function getVideoTranscript(videoId) {
  console.log(`🎬 Fetching transcript for video: ${videoId}`);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  // Primary: Try Supadata API
  const SUPADATA_API_KEY = process.env.SUPADATA_API_KEY;
  if (!SUPADATA_API_KEY) {
    console.warn('❌ SUPADATA_API_KEY is not set in environment variables.');
    return null;
  }

  try {
    console.log('📡 Using Supadata API...');
    const response = await axios.get('https://api.supadata.ai/v1/transcript', {
      params: { url: videoUrl },
      headers: { 'x-api-key': SUPADATA_API_KEY },
      timeout: 15000
    });

    if (response.data && response.data.content && response.data.content.length > 0) {
      const transcript = response.data.content.map(segment => segment.text).join(' ');
      console.log(`✅ Supadata: Got transcript (${transcript.length} chars)`);
      return transcript;
    } else if (response.data && response.data.message) {
      console.warn(`❌ Supadata API returned message for ${videoId}: ${response.data.message}`);
      return null;
    }
  } catch (err) {
    console.warn(`❌ Supadata API failed for ${videoId}: ${err.message}`);
    if (err.response && err.response.data && err.response.data.message) {
      console.warn(`Supadata Error Details: ${err.response.data.message}`);
    }
  }

  console.log(`❌ No transcript available for ${videoId}`);
  return null;
}

module.exports = { getVideoTranscript };