// 1. Bring in the Express tool
const express = require('express');
const app = express();

// 2. Set the port to 3000
const port = 3000;

// 3. Tell the server what to say when someone visits the page
app.get('/', (req, res) => {
    res.send('Hello, world! My project is running!');
});

// 4. Start the server
app.listen(port, () => {
    console.log(`Success! Your project is running at http://localhost:${port}`);
});