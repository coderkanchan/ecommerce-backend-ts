import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, products } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: "API Key missing" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tum NexusMart ke assistant ho. Products: ${JSON.stringify(products)}. User: ${userQuery}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, answer: text });
  } catch (error: any) {
    console.error("AI ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};