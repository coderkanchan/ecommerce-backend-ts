import { Request, Response } from 'express';

import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const models = await genAI.listModels();
    console.log("AVAILABLE MODELS FOR YOUR KEY:", JSON.stringify(models, null, 2));

    try {
      const { userQuery, products } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        console.error("Missing Gemini API Key in Environment!");
        return res.status(500).json({ success: false, message: "Server configuration error" });
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const prompt = `Tum NexusMart ke ek professional shopping assistant ho. 
    Hamare paas ye products hain: ${JSON.stringify(products)}. 
    User ne pucha hai: "${userQuery}". 
    Short aur helpful jawab do.`;

      const result = await model.generateContent(prompt);

      if (!result.response) {
        throw new Error("AI ne koi response nahi diya");
      }

      const text = result.response.text();
      res.status(200).json({ success: true, answer: text });

    } catch (error: any) {
      console.error("DETAILED AI ERROR:", error);
      res.status(500).json({ success: false, message: error.message || "Something went wrong" });
    }
  } catch (e) {
    console.error("List Models Error:", e);
  }

};