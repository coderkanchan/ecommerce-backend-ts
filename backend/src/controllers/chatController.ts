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
    const chat = await Chat.findOne({ userId: req.params.userId });

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat" });
  }
};

export const clearChat = async (req: Request, res: Response) => {
  try {
    await Chat.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing chat" });
  }
};