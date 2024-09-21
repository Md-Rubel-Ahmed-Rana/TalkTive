import { Router } from "express";
import { MessageController } from "../controller/message.controller";
const router = Router();

router.post("/send/:sender/:receiver", MessageController.sendMessage);

router.get("/:chatId", MessageController.getMessagesByChatId);

router.patch("/update/:id", MessageController.updateMessage);

router.delete("/delete/:id", MessageController.deleteMessage);

export const MessageRoutes = router;
