export default async function handler(req, res) {
  // ✅ Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
}
