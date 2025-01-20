const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Define a route for a POST request
app.post('/data', (req, res) => {
    const data = req.body;
    res.json({ message: 'Data received!', data });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
