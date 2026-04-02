import express from "express";
import { saveMessage, getChat, clearChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/save", saveMessage);

router.get("/:userId", getChat);

router.delete("/:userId", clearChat);

export default router;