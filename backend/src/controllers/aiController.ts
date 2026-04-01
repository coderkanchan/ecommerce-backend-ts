import { Request, Response } from "express";
export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    console.log("REQ BODY:", req.body);

    const message = req.body.message || req.body.query;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    res.json({
      answer: data.choices?.[0]?.message?.content || "No response",
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
};