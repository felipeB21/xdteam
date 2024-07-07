import { Router } from "express";
const router = Router();

import { verifyJWT } from "../middleware/verify.js";
import { createNewTeam } from "../controller/team.controller.js";

router.post("/create", verifyJWT, createNewTeam);

export default router;
