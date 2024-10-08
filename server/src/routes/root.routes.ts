import { Router } from "express";
import { UserRoutes } from "./user.routes";
import { MessageRoutes } from "./message.routes";
import { AuthRoutes } from "./auth.routes";
import { ChatRoutes } from "./chat.routes";

const router = Router();

router.use("/user", UserRoutes);

router.use("/auth", AuthRoutes);

router.use("/chat", ChatRoutes);

router.use("/message", MessageRoutes);

export const RootRoutes = router;
