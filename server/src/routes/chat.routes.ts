import { Router } from "express";
import { ChatController } from "../controller/chat.controller";
import { upload, uploadGroupImage } from "../middleware/cloudinary";

const router = Router();

router.post(
  "/add-new-chat",
  upload.single("groupImage"),
  uploadGroupImage(),
  ChatController.addNewChat
);

router.get("/my-chat-list/:participantId", ChatController.myChatList);

router.get("/:id", ChatController.getSingleChat);

router.get(
  "/single/:participant1/:participant2",
  ChatController.getChatByTwoParticipants
);

export const ChatRoutes = router;
