import { Router } from "express";
const router = Router();

import { verifyJWT } from "../middleware/verify.js";
import { upload } from "../middleware/upload.js";
import {
  createNewTeam,
  leaveTeam,
  getAllTeams,
  deleteTeam,
  getTeamByName,
} from "../controller/team.controller.js";

router.post("/create", verifyJWT, upload.single("img"), createNewTeam);
router.get("/leave", verifyJWT, leaveTeam);
router.get("/all", getAllTeams);
router.get("/:name", getTeamByName);
router.delete("/delete/:name", verifyJWT, deleteTeam);

export default router;
