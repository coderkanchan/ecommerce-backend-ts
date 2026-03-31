import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, products } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const prompt = `
You are an ecommerce assistant.

Products:
${JSON.stringify(products || [])}

User: ${userQuery}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = result.text;

    res.status(200).json({ answer: text });

  } catch (error: any) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

