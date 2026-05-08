import { Response } from "express";
import { Chat } from "../models/Chat.js";
import { Product } from "../models/Product.js";
import { index } from "../config/pinecone.js";
import { getEmbedding } from "../utils/embedding.js";

type AIResponse = {
  action: "add_to_cart" | "not_found" | "chat";
  message: string;
  productName?: string;
};

export const handleAIQuery = async (req: any, res: Response) => {
  try {
    const { userQuery } = req.body;
    const userId = req.user?._id || "guest_user";

    if (!userQuery) {
      return res.status(400).json({ message: "Message is required" });
    }

    const queryVector = await getEmbedding(userQuery);
    const vectorSearch = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    const matchedProducts = vectorSearch.matches?.map((m: any) => ({
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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a professional AI shopping assistant for NexusMart.
            Rules:
            - Respond ONLY in valid JSON.
            - Use the provided context for product info.
            - If the user wants to buy or add a product, set action to "add_to_cart" and provide the exact productName from the context.
            - Keep messages friendly and concise.
            
            Context (Available Products): ${JSON.stringify(matchedProducts)}
            
            JSON Structure:
            { 
              "action": "add_to_cart" | "not_found" | "chat", 
              "message": "your response string", 
              "productName": "exact product name from context if adding to cart" 
            }`
          },
          ...historyMessages,
          { role: "user", content: userQuery },
        ],
      }),
    });

    const data = await response.json();
    const parsed: AIResponse = JSON.parse(data.choices[0].message.content);

    let aiMessage = parsed.message;

    if (parsed.action === "add_to_cart" && parsed.productName) {
      const dbProduct = await Product.findOne({
        name: { $regex: new RegExp(parsed.productName, "i") }
      });

      if (!dbProduct) {
        const fallbackProduct = await Product.findOne({
          name: { $regex: parsed.productName.split(' ')[0], $options: 'i' }
        });

        if (fallbackProduct) {
          parsed.productName = fallbackProduct.name;
        } else {
          parsed.action = "not_found";
          aiMessage = `I see you're interested in ${parsed.productName}, but I couldn't find it in our current catalog.`;
        }
      } else {
        parsed.productName = dbProduct.name;
      }
    }

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
    res.status(500).json({ message: "AI assistant is temporarily unavailable." });
  }
};