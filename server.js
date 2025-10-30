// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Meme Generator Backend is Running!");
});

// Meme generate route
app.get("/meme", async (req, res) => {
  const text = req.query.text || "funny meme";

  try {
    const response = await fetch(
      `https://meme-api.com/gimme/${encodeURIComponent(text)}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meme" });
  }
});

// Render port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
