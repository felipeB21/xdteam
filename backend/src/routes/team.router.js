import { Router } from "express";
const router = Router();

import { verifyJWT } from "../middleware/verify.js";
import { upload } from "../middleware/upload.js";
import {
  createNewTeam,
  leaveTeam,
  getAllTeams,
} from "../controller/team.controller.js";

router.post("/create", verifyJWT, upload.single("img"), createNewTeam);
router.get("/leave", verifyJWT, leaveTeam);
router.get("/all", getAllTeams);

export default router;
