import express from "express";
import { saveMessage, getChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/save", saveMessage);
router.get("/:userId", getChat);

export default router;