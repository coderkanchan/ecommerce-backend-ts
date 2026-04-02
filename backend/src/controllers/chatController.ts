import { Request, Response } from "express";
import { Chat } from "../models/Chat.js";

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const { userId, role, content } = req.body;

    let chat = await Chat.findOne({ user: userId });

    if (!chat) {
      chat = new Chat({
        user: userId,
        messages: [],
      });
    }

    chat.messages.push({ role, content });
    await chat.save();

    res.json({ success: true, chat });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving chat" });
  }
};


export const getChat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const chat = await Chat.findOne({ user: userId });

    res.json(chat || { messages: [] });

  } catch (error) {
    res.status(500).json({ message: "Error fetching chat" });
  }
};

export const clearChat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await Chat.findOneAndDelete({ user: userId });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error clearing chat" });
  }
};