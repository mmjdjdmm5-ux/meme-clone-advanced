// backend/server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple AI Meme Caption Generator (placeholder)
app.post("/generate-meme", async (req, res) => {
  const { text } = req.body;

  // For now, just mock AI output
  const caption = `🤖 AI Meme Idea: ${text.toUpperCase()} 😂`;

  res.json({ caption });
});

app.get("/", (req, res) => {
  res.send("Meme AI backend running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
