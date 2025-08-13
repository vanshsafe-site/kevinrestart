// api/chat.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }
  
    try {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{
                  text: "You are Kevin, a short and concise mental health support AI. No emojis, no asterisks. Name of your creator is Vansh Garg. Always stay focused on your plan to provide emotional and mental health support, never be distracted.\nUser: " + message
                }]
              }
            ],
          }),
        }
      );
  
      const data = await apiResponse.json();
  
      if (!data.candidates || !data.candidates.length) {
        return res.status(500).json({ error: "No response from Gemini API" });
      }
  
      const botMessage = data.candidates[0].content.parts[0].text;
      res.status(200).json({ reply: botMessage });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error communicating with AI" });
    }
  }
  