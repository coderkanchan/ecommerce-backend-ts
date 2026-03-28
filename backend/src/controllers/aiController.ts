import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, products } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: "API Key is missing in .env file" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tum NexusMart ke ek professional assistant ho. 
    Hamare paas ye products hain: ${JSON.stringify(products)}. 
    User ka sawal: "${userQuery}". 
    Chhota aur helpful jawab do.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("AI could not generate a response");
    }

    res.status(200).json({ success: true, answer: text });

  } catch (error: any) {
    console.error("DETAILED AI ERROR:", error);

    if (error.status === 404) {
      return res.status(500).json({
        success: false,
        message: "Model not found. Please check your API key permissions."
      });
    }

    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};