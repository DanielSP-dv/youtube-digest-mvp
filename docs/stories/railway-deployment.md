# Railway Deployment

Great progress! Your app is deployed and running on Railway. I can see it's running on port 5001, but you need to click "Generate Domain" to make it publicly accessible. Here's what to do:

## Final Steps to Complete Deployment

### Step 1: Generate Your Public Domain

In your Railway dashboard (second image):
1. Click the **"Generate Domain"** button in the Networking section
2. Railway will create a URL like `youtube-digest-mvp-production.up.railway.app`

### Step 2: Fix the PORT Issue

Your app is running on port 5001, but Railway expects it to use the PORT environment variable. Update your `server.js`:

```javascript
// Change this line at the bottom:
const port = process.env.PORT || 5001;

// Make sure app.listen uses the port variable:
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

### Step 3: Add Missing Environment Variable

You already have CLIENT_URL set, but need to update CALLBACK_URL:

In Railway dashboard, go to Variables tab and add:
```
CALLBACK_URL=https://youtube-digest-mvp-production.up.railway.app/auth/google/callback
```

### Step 4: Build React Frontend

Your backend is running but needs to serve the React build. Add this build command:

1. Go to Settings tab in Railway
2. Under "Build Command", add:
   ```
   npm run build
   ```

3. Make sure your root `package.json` has:
   ```json
   "scripts": {
     "start": "node server.js",
     "build": "cd client && npm install && npm run build"
   }
   ```

### Step 5: Redeploy

After making these changes:
1. Commit and push to GitHub (if connected)
2. Or run `railway up` again from terminal

### Step 6: Update Google OAuth

Once you have your Railway domain, update Google Cloud Console with your new URLs.

## Current Status

✅ Backend deployed and running  
✅ Environment variables set  
⏳ Need to generate domain  
⏳ Need to build React frontend  
⏳ Need to fix PORT configuration  

Click "Generate Domain" first, then we can complete the rest!
