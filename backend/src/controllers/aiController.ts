import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const message = req.body.userQuery;
    const products = req.body.products || [];

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
            content: `
You are a smart AI shopping assistant.

IMPORTANT RULES:
- Only suggest products from the given list
- NEVER invent new product names
- Use exact or closest matching product name from list

If user wants to add product:
{
  "action": "add_to_cart",
  "productName": "EXACT product name from list"
}

If product not found:
{
  "action": "chat",
  "message": "Product not available. Available products are: ..."
}

Available products:
${JSON.stringify(products)}
`
          }, {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content;

    let parsed;

    try {
      parsed = JSON.parse(aiText);
      if (!parsed.action) {
        parsed = { action: "chat", message: aiText };
      }
    } catch {
      parsed = { action: "chat", message: aiText };
    }

    await Chat.findOneAndUpdate(
      { userId: "demoUser" },
      {
        $push: {
          messages: [
            { role: "user", content: message },
            { role: "ai", content: parsed.message || aiText },
          ],
        },
      },
      { upsert: true }
    );
    return res.json(parsed);
  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
};