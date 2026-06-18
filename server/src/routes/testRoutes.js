import express from "express";

import {
  citizenPanel,
  officerPanel,
  adminPanel,
} from "../controllers/testController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/citizen",
  protect,
  authorize("citizen"),
  citizenPanel
);

router.get(
  "/officer",
  protect,
  authorize("officer"),
  officerPanel
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  adminPanel
);

export default router;