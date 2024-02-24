import { Router } from "express";
import { UserRoutes } from "./user.routes";
import { MessageRoutes } from "./message.routes";
import { FileUploadRoutes } from "./fileUpload.routes";

const router = Router();

router.use("/user", UserRoutes);

router.use("/message", MessageRoutes);

router.use("/cloudinary", FileUploadRoutes);

export const RootRoutes = router;
