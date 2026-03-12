import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const handleAIQuery = async (req: Request, res: Response) => {
  try {
    const { userQuery, products } = req.body; 
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tum NexusMart ke ek professional shopping assistant ho. 
    Hamare paas ye products hain: ${JSON.stringify(products)}. 
    User ne pucha hai: "${userQuery}". 
    Sirf hamare products ke basis par best recommendation do. Short aur helpful jawab do.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.status(200).json({ success: true, answer: response.text() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};