import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("API KEY:", process.env.GEMINI_API_KEY);

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, products } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "API key missing" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const prompt = `
    You are a helpful ecommerce assistant.

    Products:
    ${JSON.stringify(products || [])}

    User: ${userQuery}
    `;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.status(200).json({ answer: text });

  } catch (error: any) {
    console.error("❌ AI ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


