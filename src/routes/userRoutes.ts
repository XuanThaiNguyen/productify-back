import { Router } from "express";

import * as userController from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth, userController.syncUser);

export default router;
