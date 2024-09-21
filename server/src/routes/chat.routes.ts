import { Router } from "express";
import { ChatController } from "../controller/chat.controller";

const router = Router();

router.post("/add-new-chat", ChatController.addNewChat);

router.get("/my-chat-list/:participantId", ChatController.myChatList);

export const ChatRoutes = router;
