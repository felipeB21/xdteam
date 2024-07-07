import { Router } from "express";
const router = Router();

import {
  createNewUser,
  findUser,
  verifyToken,
  handleRefreshToken,
  logoutUser,
  userData,
  findUserByParams,
  intOfUsers,
} from "../controller/user.controller.js";

router.post("/register", createNewUser);
router.post("/login", findUser);
router.get("/verify", verifyToken);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/data", userData);
router.get("/profile/:username", findUserByParams);
router.get("/length", intOfUsers);

export default router;
