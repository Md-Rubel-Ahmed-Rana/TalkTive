import { Router } from "express";
import { UserRoutes } from "./user.routes";

const router = Router();

router.use("/user", UserRoutes);

export const RootRoutes = router;
