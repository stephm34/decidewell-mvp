const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/claude", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLAUDE_API_KEY,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        temperature: 0.5,
        system: "You are a helpful assistant that evaluates decisions.",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();
    res.status(200).json({ result: result?.content?.[0]?.text || "No response" });
  } catch (error) {
    console.error("Claude API Error:", error);
    res.status(500).json({ result: "Error connecting to Claude API." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
