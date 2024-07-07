import { Router } from "express";
const router = Router();

import {
  createNewUser,
  findUser,
  verifyToken,
  handleRefreshToken,
  logoutUser,
  userData,
} from "../controller/user.controller.js";

router.post("/register", createNewUser);
router.post("/login", findUser);
router.get("/verify", verifyToken);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/data", userData);

export default router;
