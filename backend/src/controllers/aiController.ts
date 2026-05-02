import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";
import { Product } from "../models/Product.js";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { index } from "../config/pinecone.js";

const searchProducts = async (query: string) => {
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  const output = await embedder(query);
  const queryVector = Array.from(output.data);

  const result = await index.query({
    vector: queryVector,
    topK: 3,
    includeMetadata: true,
  });

  return result.matches.map((m: any) => m.metadata.name);
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

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

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuery,
    });

    const queryVector = embeddingRes.data[0].embedding;

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
      ? previousChat.messages.slice(-6).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content || "",
      }))
      : [];

    const lastProduct =
      previousChat?.messages
        ?.slice()
        .reverse()
        .find(m => m.content?.includes("added to cart"))
        ?.content?.split(" added")[0] || null;

    const chatRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a professional AI shopping assistant.

STRICT RULES:
- ONLY return JSON
- NO extra text

INTENT:
- "yes", "ok", "add it" → use lastProduct
- buying intent → add_to_cart
- product not found → not_found
- otherwise → chat

LAST PRODUCT:
${lastProduct || "none"}

RELEVANT PRODUCTS:
${JSON.stringify(matchedProducts)}

RESPONSE FORMAT:

{ "action": "add_to_cart", "productName": "EXACT NAME" }
{ "action": "not_found", "message": "Product not available" }
{ "action": "chat", "message": "..." }
`
        }, Relevant products from database:
        ${ JSON.stringify(similarProducts) }

        ...historyMessages,

        {
          role: "user",
          content: userQuery,
        },
      ],
    });

    let aiText = chatRes.choices[0]?.message?.content || "";
    aiText = aiText.replace(/```json|```/g, "").trim();

    let parsed: AIResponse;

    try {
      const match = aiText.match(/\{[\s\S]*\}/);
      parsed = match
        ? JSON.parse(match[0])
        : { action: "chat", message: aiText };
    } catch {
      parsed = { action: "chat", message: "Sorry, I didn’t understand that." };
    }

    const dbProduct = await Product.findOne({ name: parsed.productName });

    if (parsed.action === "add_to_cart" && !dbProduct) {
      parsed = {
        action: "not_found",
        message: "Product not available",
      };
    }

    const responseMap: Record<string, string> = {
      add_to_cart: `${parsed.productName} added to cart 🛒`,
      not_found: parsed.message || "Product not available",
      chat: parsed.message || "How can I help you?",
    };

    const aiMessage = responseMap[parsed.action] || "Something went wrong";

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