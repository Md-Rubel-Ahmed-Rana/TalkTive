"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const jwt_1 = require("../middleware/jwt");
const auth_controller_1 = require("../controller/auth.controller");
const router = (0, express_1.Router)();
router.get("/", jwt_1.JwtInstance.verifyToken, auth_controller_1.AuthController.auth);
router.post("/login", auth_controller_1.AuthController.login);
router.delete("/logout", jwt_1.JwtInstance.verifyToken, auth_controller_1.AuthController.logout);
exports.AuthRoutes = router;