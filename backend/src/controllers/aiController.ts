import { Request, Response } from "express";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    console.log("REQ BODY:", req.body);

    const message = req.body.userQuery || req.body.message || req.body.query;

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
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are an AI shopping assistant. Help users find products from this list: ${JSON.stringify(req.body.products)}`
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    const aiText = data?.choices?.[0]?.message?.content;

    res.status(200).json({
      answer: aiText || "No response from AI",
    });
    console.log("AI TEXT:", aiText);
  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
};