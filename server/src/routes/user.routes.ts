import { Router } from "express";
import { UserController } from "../controller/user.controller";

const router = Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/auth", UserController.auth);

router.get("/", UserController.getUsers);

router.get("/sorted-users/:userId", UserController.getSortedUsersToChat);

export const UserRoutes = router;
