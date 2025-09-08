const express = require('express');
const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Hello World! Express server is working!');
});

app.listen(port, () => {
  console.log(`Test server listening on port ${port}`);
});


