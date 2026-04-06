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

    const productNames = JSON.stringify(products.map(p => p.name));

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
You are a strict AI shopping assistant.

RULES:
- ONLY return JSON
- DO NOT add explanation
- DO NOT add extra text
- ONLY use product names EXACTLY from the list
- DO NOT modify names
- DO NOT guess
- productName MUST be EXACTLY one of the names from the list
- do not change casing, spelling, or spacing

If user wants to add product:
{
  "action": "add_to_cart",
  "productName": "EXACT NAME FROM LIST"
}

If not found:
{
  "action": "not_found",
  "message": "Product not available",
  "suggestions": ["product1", "product2"]
}

Otherwise:
{
  "action": "chat",
  "message": "your reply"
}

Available products:
${productNames}
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
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { action: "chat", message: aiText };
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