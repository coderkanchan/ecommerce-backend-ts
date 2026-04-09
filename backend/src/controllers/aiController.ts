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
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
- productName MUST match EXACTLY from list

INTENT:
- "yes", "ok", "add it" → add last suggested product
- buying intent → add_to_cart
- unknown → chat
- not found → not_found

Available products:
${JSON.stringify(productNames)}

Response formats:

{ "action": "add_to_cart", "productName": "..." }
{ "action": "not_found", "message": "Product not available" }
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
      const match = aiText.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { action: "chat", message: aiText };
    } catch {
      parsed = { action: "chat", message: "Sorry, something went wrong" };
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

    const formatResponse = (data: any) => {
      const map: any = {
        add_to_cart: `${data.productName} added to cart 🛒`,
        not_found: data.message || "Product not available",
        chat: data.message || "How can I help you?"
      };

      return map[data.action] || "Something went wrong";
    };

    const aiMessage = formatResponse(parsed);

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