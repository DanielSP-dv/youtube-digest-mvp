const { google } = require('googleapis');

async function getSubscriptions(accessToken, refreshToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL
  );
  oauth2Client.setCredentials({ 
    access_token: accessToken,
    refresh_token: refreshToken
  });
  
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });
  
  const response = await youtube.subscriptions.list({
    part: 'snippet',
    mine: true,
    maxResults: 50
  });
  
  return response.data.items.map(item => ({
    channelId: item.snippet.resourceId.channelId,
    channelName: item.snippet.title,
    channelThumbnail: item.snippet.thumbnails.default.url
  }));
}

async function getLatestVideosByChannel(accessToken, refreshToken, channelId, maxResults = 5) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  const response = await youtube.search.list({
    part: 'snippet',
    channelId: channelId,
    type: 'video',
    order: 'date', // Order by most recent
    maxResults: maxResults
  });

  return response.data.items.map(item => ({
    videoId: item.id.videoId,
    channelId: item.snippet.channelId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt
  }));
}

module.exports = { getSubscriptions, getLatestVideosByChannel };