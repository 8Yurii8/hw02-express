import express from "express";
import { validateBody } from "./decorators/validateBody.js";
import userShemas from "../../schemas/userShemas.js";
import authController from "../../controllers/auth/authController.js";
import { authenticate, upload } from "../../middlewares/index.js";

const authRoter = express.Router();
authRoter.post(
  "/register",
  upload.single("avatar"),
  validateBody(userShemas.userRegisterShema),
  authController.register
);
authRoter.post(
  "/login",
  validateBody(userShemas.userRegisterShema),
  authController.login
);
authRoter.get("/curren", authenticate, authController.getCurren);
authRoter.post(
  "/signout",

  authenticate,
  authController.signout
);
authRoter.patch("/", authenticate, authController.updateSubscription);
authRoter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.updateAvatar
);
export default authRoter;
