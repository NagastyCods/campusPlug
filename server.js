const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3300;

// Serve static files from the "public" directory
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public',  'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});