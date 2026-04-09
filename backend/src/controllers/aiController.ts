import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";
import { Product } from "../models/Product.js";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, userId = "demoUser" } = req.body;

    if (!userQuery) {
      return res.status(400).json({ message: "Message is required" });
    }

    const products = await Product.find().select("name");
    const productNames = products.map(p => p.name);

    const previousChat = await Chat.findOne({ userId });

    const historyMessages = previousChat
      ? previousChat.messages.slice(-5).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content
      }))
      : [];

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
- ALWAYS return JSON
- NO extra text
- productName MUST match EXACTLY

Available products:
${JSON.stringify(productNames)}

Response formats:

1. Add to cart:
{ "action": "add_to_cart", "productName": "..." }

2. Not found:
{ "action": "not_found", "message": "Product not available" }

3. Chat:
{ "action": "chat", "message": "..." }
`
          },
          ...historyMessages,
          { role: "user", content: userQuery }
        ],
      }),
    });

    const data = await response.json();

    let aiText = data?.choices?.[0]?.message?.content || "";
    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { action: "chat", message: aiText };
    } catch {
      parsed = { action: "chat", message: aiText };
    }

    if (
      parsed.action === "add_to_cart" &&
      !productNames.includes(parsed.productName)
    ) {
      parsed = {
        action: "not_found",
        message: "Product not available"
      };
    }

    const getMessage = () => {
      switch (parsed.action) {
        case "add_to_cart":
          return `${parsed.productName} added to cart 🛒`;

        case "not_found":
          return parsed.message || "Product not available";

        case "chat":
          return parsed.message || "How can I help you?";

        default:
          return "Something went wrong";
      }
    };

    const aiMessage = getMessage();

    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: {
          messages: [
            { role: "user", content: userQuery },
            { role: "ai", content: aiMessage },
          ],
        },
      },
      { upsert: true }
    );

    return res.json({
      action: parsed.action,
      message: aiMessage,
      productName: parsed.productName || null
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
};