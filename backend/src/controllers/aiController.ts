import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";
import { Product } from "../models/Product.js";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const message = req.body.userQuery;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const products = await Product.find().select("name category price");

    const productNames = products.map(p => p.name);

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

STRICT RULES:
- ONLY return valid JSON
- DO NOT write any extra text
- DO NOT explain anything
- ONLY use given products

If user wants to add product:
Return ONLY:
{
  "action": "add_to_cart",
  "productName": "EXACT NAME"
}

If product not found:
Return ONLY:
{
  "action": "not_found",
  "message": "Product not available",
  "suggestions": ["${productNames.slice(0, 3).join('","')}"]
}

Available products:
${productNames.join(", ")}
`
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    let aiText = data?.choices?.[0]?.message?.content;

    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
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