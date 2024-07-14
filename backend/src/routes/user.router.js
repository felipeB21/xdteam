import { Router } from "express";
import { verifyJWT } from "../middleware/verify.js";
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
  ubiUserApi,
  searchUserUbiByParams,
  setUbiId,
} from "../controller/user.controller.js";

router.post("/register", createNewUser);
router.post("/login", findUser);
router.get("/verify", verifyToken);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.get("/data", userData);
router.get("/profile/:username", findUserByParams);
router.get("/length", intOfUsers);
router.get("/ubi/:username", ubiUserApi);
router.get("/ubi/q/search", searchUserUbiByParams);
router.post("/ubi/id/set/:username", verifyJWT, setUbiId);

export default router;
