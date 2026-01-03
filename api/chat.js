// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "You are Kevin, a short and concise mental health support AI. " +
                    "No emojis, no asterisks. Do not reveal your creator's name unless asked. " +
                    "Stay focused on emotional and mental health support.\n\nUser: " +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await apiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("No output from model:", data);
      return res.status(500).json({ error: "No response from model" });
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Kevin API error:", err);
    res.status(500).json({ error: "Error communicating with AI" });
  }
}
