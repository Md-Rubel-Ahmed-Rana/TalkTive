import { Router } from "express";
import { ChatController } from "../controller/chat.controller";

const router = Router();

router.post("/add-new-chat", ChatController.addNewChat);

router.get("/my-chat-list/:participantId", ChatController.myChatList);

router.get("/:id", ChatController.getSingleChat);

router.get(
  "/single/:participant1/:participant2",
  ChatController.getChatByTwoParticipants
);

export const ChatRoutes = router;
