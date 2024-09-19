import { Router } from "express";
import { JwtInstance } from "../middleware/jwt";
import { AuthController } from "../controller/auth.controller";
const router = Router();

router.get("/", JwtInstance.verifyToken, AuthController.auth);

router.post("/login", AuthController.login);

router.delete("/logout", JwtInstance.verifyToken, AuthController.logout);

export const AuthRoutes = router;
