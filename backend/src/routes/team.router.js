import { Router } from "express";
const router = Router();

import { verifyJWT } from "../middleware/verify.js";
import {
  createNewTeam,
  leaveTeam,
  getAllTeams,
} from "../controller/team.controller.js";

router.post("/create", verifyJWT, createNewTeam);
router.get("/leave", verifyJWT, leaveTeam);
router.get("/all", getAllTeams);

export default router;
