
require('dotenv').config();
const { getVideoTranscript } = require('./services/transcript');

async function testTranscript() {
  const videoId = 'lV7mEvVVV8A'; // YouTube video from https://www.youtube.com/watch?v=lV7mEvVVV8A
  console.log(`Fetching transcript for video ID: ${videoId}...`);

  try {
    const transcript = await getVideoTranscript(videoId);
    if (transcript) {
      console.log('Successfully fetched transcript:');
      console.log(transcript.substring(0, 500) + '...'); // Print first 500 chars
    } else {
      console.log('No transcript returned, but no error was thrown.');
    }
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
  }
}

testTranscript();
