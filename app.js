const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage for product keys (use a database in production)
const productKeys = {};

// Generate a product key
app.post('/product-keys', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const productKey = `KEY-${email}-${Date.now()}`;
    productKeys[productKey] = { email, active: true };
    res.status(201).json({ productKey });
});

// Verify a product key
app.get('/product-keys/:key', (req, res) => {
    const { key } = req.params;
    if (productKeys[key]?.active) {
        return res.json({ valid: true });
    }
    res.json({ valid: false });
});

// Invalidate a product key
app.delete('/product-keys/:key', (req, res) => {
    const { key } = req.params;
    if (productKeys[key]) {
        productKeys[key].active = false;
        return res.json({ success: true });
    }
    res.status(404).json({ error: 'Product key not found' });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('API is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
