import { Router } from "express";
import { MessageController } from "../controller/message.controller";
import { upload, uploadMessageFiles } from "../middleware/cloudinary";
const router = Router();

router.post(
  "/send/:sender/:receiver",
  upload.array("files"),
  uploadMessageFiles(),
  MessageController.sendMessage
);

router.get("/:chatId/:participantId", MessageController.getMessagesByChatId);

router.patch("/read/:chatId/:participantId", MessageController.readMessages);

router.patch("/update/:id", MessageController.updateMessage);

router.delete("/delete/:id", MessageController.deleteMessage);

export const MessageRoutes = router;
