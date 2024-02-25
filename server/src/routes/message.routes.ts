import { Router } from "express";
import { MessageController } from "../controller/message.controller";
const router = Router();

router.post("/send", MessageController.sendMessage);

router.get("/:sender/:receiver", MessageController.getMessages);
router.get("/all", MessageController.getAllMessages);

export const MessageRoutes = router;
