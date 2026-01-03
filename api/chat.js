// api/chat.js

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GOOGLE_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "You are Kevin, a short and concise mental health support AI. " +
                    "No emojis, no asterisks. Do not reveal your creator's name unless explicitly asked. " +
                    "Stay focused only on emotional and mental health support.\n\nUser: " +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Gemini response:", data);
      return res.status(500).json({ error: "No response from Kevin" });
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Kevin API error:", error);
    res.status(500).json({ error: "Kevin is currently unavailable" });
  }
}
