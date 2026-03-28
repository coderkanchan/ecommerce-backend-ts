import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleAIQuery = async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing Gemini API Key in Environment!");
    return res.status(500).json({ success: false, message: "Server configuration error" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { userQuery, products } = req.body;

    const modelName = "gemini-1.5-flash"; 
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Tum NexusMart ke ek professional shopping assistant ho. 
    Hamare paas ye products hain: ${JSON.stringify(products)}. 
    User ne pucha hai: "${userQuery}". 
    Ek helpful aur short jawab do.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("AI ne koi response nahi diya");
    }

    res.status(200).json({ success: true, answer: text });

  } catch (error: any) {
    console.error("DETAILED AI ERROR:", error);
    
    const errorMessage = error.status === 404 
      ? "AI Model not found. Please check your API key and model name." 
      : (error.message || "Something went wrong");

    res.status(500).json({ success: false, message: errorMessage });
  }
};