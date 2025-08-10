const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3300;
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// load routes
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/payment');
const paystackWebhookRoutes = require('./routes/webhook');
app.use('/api/pay', paymentRoutes);
app.use("/api", orderRoutes);
app.use('/webhook',paystackWebhookRoutes);

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public',  'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});