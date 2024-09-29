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

router.get(
  "/my-deleted-chat-list/:participantId",
  ChatController.getDeletedChatList
);

router.get("/:id", ChatController.getSingleChat);

router.get(
  "/single/:participant1/:participant2",
  ChatController.getChatByTwoParticipants
);

router.patch(
  "/add-new-participant/:chatId/:participantId",
  ChatController.addNewParticipant
);

router.patch(
  "/remove-participant/:chatId/:participantId",
  ChatController.removeParticipant
);

router.patch("/update/:chatId", ChatController.updateChatInfo);

router.patch(
  "/change-group-image/:chatId",
  upload.single("groupImage"),
  uploadGroupImage(),
  ChatController.changeGroupImage
);

router.delete("/delete/:chatId", ChatController.deleteChat);

router.patch(
  "/delete-chat/:chatId/:participantId",
  ChatController.chatDeletedBy
);

router.patch("/clear-chat/:chatId/:participantId", ChatController.clearChat);

router.patch(
  "/restore-chat/:chatId/:participantId",
  ChatController.restoreDeletedChat
);

router.patch(
  "/restore-clear-chat/:chatId/:participantId",
  ChatController.restoreClearChat
);

export const ChatRoutes = router;
