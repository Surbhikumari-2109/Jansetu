import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  getAllComplaints,
} from "../controllers/complaintController.js";
import { upload } from "../middleware/uploadMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Complaint
router.post(
  "/create",
  protect,
  upload.array("images", 3),
  createComplaint
);
// Citizen's Complaints
router.get(
  "/my-complaints",
  protect,
  getMyComplaints
);

// Officer - All Complaints
router.get(
  "/all",
  protect,
  getAllComplaints
);

// Single Complaint
router.get(
  "/:id",
  protect,
  getComplaintById
);

// Update Status
router.put(
  "/:id/status",
  protect,
  updateComplaintStatus
);

export default router;