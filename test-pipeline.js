require('dotenv').config();
const { getVideoTranscript } = require('./services/transcript');
const openaiService = require('./services/openai');

async function testFullPipeline() {
  // Test with a recent Formula 1 video - replace with actual video ID
  const videoId = 'rX5CMF0CpeE'; // Formula 1 video from 18h ago
  console.log('🎬 Testing Formula 1 video:', videoId);
  console.log('=' .repeat(60));
  
  const transcript = await getVideoTranscript(videoId);
  if (!transcript) {
    console.log('❌ No transcript available');
    return;
  }
  
  console.log('✅ Transcript retrieved:', transcript.length, 'characters');
  console.log('📝 First 200 chars:', transcript.substring(0, 200) + '...');
  
  console.log('\n🤖 Generating AI summary...');
  const summary = await openaiService.generateSummary(transcript);
  
  if (summary) {
    console.log('✅ Summary generated:', summary.length, 'characters');
    console.log('📊 Compression ratio:', (transcript.length / summary.length).toFixed(2) + ':1');
    console.log('\n📋 SUMMARY:');
    console.log('─'.repeat(50));
    console.log(summary);
    console.log('─'.repeat(50));
  } else {
    console.log('❌ Failed to generate summary');
  }
}

testFullPipeline();