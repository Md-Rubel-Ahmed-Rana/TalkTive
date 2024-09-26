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

router.get(
  "/search-user/:chatId",
  UserController.getUsersExceptExistingParticipants
);

router.get("/:id", UserController.getSingleUserInfo);

router.patch("/update-user-info/:id", UserController.updateUserInfo);

router.patch(
  "/change-profile-picture/:id",
  upload.single("image"),
  uploadProfileImage(),
  UserController.updateProfilePicture
);

router.patch("/change-password/:id", UserController.updatePassword);

export const UserRoutes = router;
