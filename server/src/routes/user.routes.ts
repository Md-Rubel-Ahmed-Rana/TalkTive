import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { upload, uploadProfileImage } from "../middleware/cloudinary";

const router = Router();

router.post(
  "/register",
  upload.single("image"),
  uploadProfileImage(),
  UserController.register
);

router.get("/", UserController.getUsers);

router.get("/:id", UserController.getSingleUserInfo);

router.patch("/update-user-info/:id", UserController.updateUserInfo);

router.patch(
  "/change-profile-picture/:id",
  upload.single("image"),
  uploadProfileImage(),
  UserController.updateProfilePicture
);

router.patch("/change-password/:id", UserController.updatePassword);

router.get("/sorted-users/:userId", UserController.getSortedUsersToChat);

export const UserRoutes = router;
