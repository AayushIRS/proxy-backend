// proxy.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

console.log("=== Proxy server starting up! ===");

const app = express();
const PORT = process.env.PORT || 4000;

// CHANGE THIS to your current Google Apps Script Web App URL
const SHEET_API = 'https://script.google.com/macros/s/AKfycbz8eEXpeO3c4BO-Fnu4rzPGRaQMeRDMNR1iXYHdt7o5D6RokookRHqqpMg0WQotTLeHzA/exec';

app.use(cors());
app.use(express.json());

// GET (for resident lookup and history)
app.get('/api', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query).toString();
    const url = `${SHEET_API}${params ? '?' + params : ''}`;
    console.log("Proxy forwarding to:", url);
    const response = await axios.get(url);
    console.log("Proxy received data:", JSON.stringify(response.data).slice(0, 300) + (JSON.stringify(response.data).length > 300 ? '... (truncated)' : ''));
    res.json(response.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST (for issuing equipment and returning equipment)
app.post('/api', async (req, res) => {
  try {
    console.log("Proxy POST to:", SHEET_API, "with body:", req.body);
    const response = await axios.post(SHEET_API, req.body);
    console.log("Proxy POST received data:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Proxy POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});