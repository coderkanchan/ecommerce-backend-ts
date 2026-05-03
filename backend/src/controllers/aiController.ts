import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";
import { Product } from "../models/Product.js";
import { index } from "../config/pinecone.js";
import { getEmbedding } from "../utils/embedding.js";

type AIResponse = {
  action: "add_to_cart" | "not_found" | "chat";
  message?: string;
  productName?: string;
};

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, userId = "demoUser" } = req.body;

    if (!userQuery) {
      return res.status(400).json({ message: "Message is required" });
    }

    const queryVector = await getEmbedding(userQuery);

    const vectorSearch = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    const matchedProducts =
      vectorSearch.matches?.map((m: any) => ({
        name: m.metadata?.name,
        description: m.metadata?.description,
        category: m.metadata?.category,
      })) || [];

    const previousChat = await Chat.findOne({ userId });

    const historyMessages = previousChat
      ? previousChat.messages.slice(-6).map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content || "",
      }))
      : [];

    const lastProduct =
      previousChat?.messages
        ?.slice()
        .reverse()
        .find((m) => m.content?.includes("added to cart"))
        ?.content?.split(" added")[0] || null;

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
You are a professional AI shopping assistant.

STRICT RULES:
- ONLY return JSON
- NO extra text

LAST PRODUCT:
${lastProduct || "none"}

RELEVANT PRODUCTS:
${JSON.stringify(matchedProducts)}

{ "action": "add_to_cart", "productName": "..." }
{ "action": "not_found", "message": "..." }
{ "action": "chat", "message": "..." }
`,
          },
          ...historyMessages,
          { role: "user", content: userQuery },
        ],
      }),
    });

    const data = await response.json();

    let aiText = data?.choices?.[0]?.message?.content || "";
    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsed: AIResponse;

    try {
      const match = aiText.match(/\{[\s\S]*\}/);
      parsed = match
        ? JSON.parse(match[0])
        : { action: "chat", message: aiText };
    } catch {
      parsed = { action: "chat", message: "Error understanding response" };
    }

    if (parsed.action === "add_to_cart") {
      const dbProduct = await Product.findOne({ name: parsed.productName });

      if (!dbProduct) {
        parsed = {
          action: "not_found",
          message: "Product not available",
        };
      }
    }

    const responseMap: Record<string, string> = {
      add_to_cart: `${parsed.productName} added to cart 🛒`,
      not_found: parsed.message || "Product not available",
      chat: parsed.message || "How can I help you?",
    };

    const aiMessage = responseMap[parsed.action];

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
      productName: parsed.productName || null,
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
};