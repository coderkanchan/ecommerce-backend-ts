import { Response } from "express"; 
import { Chat } from "../models/Chat.js";
import { Product } from "../models/Product.js";
import { index } from "../config/pinecone.js";
import { getEmbedding } from "../utils/embedding.js";

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
            Respond ONLY in valid JSON format.
            Available Products: ${JSON.stringify(matchedProducts)}
            Structure: { "action": "add_to_cart" | "chat" | "not_found", "message": "your response", "productName": "name if adding" }`
          },
          ...historyMessages,
          { role: "user", content: userQuery },
        ],
      }),
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    let finalMessage = parsed.message;
    if (parsed.action === "add_to_cart") {
      const dbProduct = await Product.findOne({ name: parsed.productName });
      if (!dbProduct) {
        parsed.action = "not_found";
        finalMessage = "I'm sorry, that product is currently unavailable.";
      } else {
        finalMessage = `${parsed.productName} has been added to your cart! 🛒`;
      }
    }

    await Chat.findOneAndUpdate(
      { userId },
      { $push: { messages: [{ role: "user", content: userQuery }, { role: "ai", content: finalMessage }] } },
      { upsert: true }
    );

    return res.json({ action: parsed.action, message: finalMessage, productName: parsed.productName });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: "I'm having trouble connecting to my brain right now. Try again?" });
  }
};