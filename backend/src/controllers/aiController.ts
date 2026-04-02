import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const message = req.body.userQuery || req.body.message || req.body.query;
    const userId = req.body.userId || "demoUser";

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

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
            content:
              `You are a smart AI shopping assistant. You MUST respond in JSON format only. If user wants to add product: { "action": "add_to_cart",  "productName": "product name" }
            If user wants recommendation:{ "action": "recommend", "category": "category name" } 
            If normal question: { "action": "chat", "message": "your answer" }
             Available products: ${JSON.stringify(req.body.products)}`
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content || "No response";

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = new Chat({
        userId,
        messages: [],
      });
    }

    chat.messages.push(
      { role: "user", content: message },
      { role: "ai", content: aiText }
    );

    await chat.save();

    res.status(200).json({ answer: aiText });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "AI error" });
  }
};