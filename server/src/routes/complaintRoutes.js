import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getWorkers } from "../controllers/adminController.js";

import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  getAllComplaints,
  assignComplaint,
  getWorkerTasks,       // ⬅️ Import the worker tasks controller
  updateWorkerProgress  // ⬅️ Import the worker progress controller
} from "../controllers/complaintController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 🟢 Worker - Get Tasks assigned to them (Locked to workers only)
router.get(
  "/worker-tasks",
  protect,
  authorize("worker"),
  getWorkerTasks
);

// 🟢 Worker - Update progress of assigned task (Locked to workers only)
router.put(
  "/:id/worker-progress",
  protect,
  authorize("worker"),
  updateWorkerProgress
);

// 🟢 Create Complaint (Citizens only)
router.post(
  "/create",
  protect,
  authorize("citizen"), 
  upload.array("images", 3),
  createComplaint
);

// Citizen's Complaints
router.get(
  "/my-complaints",
  protect,
  authorize("citizen"),
  getMyComplaints
);

router.get("/workers", protect, authorize("officer", "admin"), getWorkers);

// Officer - All Complaints (Locked to Officers & Admins only)
router.get(
  "/all",
  protect,
  authorize("officer", "admin"), 
  getAllComplaints
);

// Single Complaint (Accessible by both roles depending on ownership)
router.get(
  "/:id",
  protect,
  getComplaintById
);

// Update Status (Locked to Officers & Admins only)
router.put(
  "/:id/status",
  protect,
  authorize("officer", "admin"), 
  updateComplaintStatus
);

// Assign Complaint to Field Worker (Locked to Officers & Admins only)
router.put(
  "/:id/assign",
  protect,
  authorize("officer", "admin"),
  assignComplaint
);

export default router;