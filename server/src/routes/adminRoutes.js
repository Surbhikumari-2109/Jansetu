import express from "express";
import { registerOfficial, getAdminStats, getWorkers } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getUsersByRole, getUsersByDepartment } from '../controllers/adminController.js';
const router = express.Router();

// 1. Exclude the worker route from the strict file-wide admin lock
router.route('/workers').get(protect, authorize("admin", "officer"), getWorkers);

// 2. Apply the strict admin lock only to administrative endpoints below it
router.use(protect, authorize("admin"));

router.post("/register-official", registerOfficial);
router.get("/stats", getAdminStats);
router.get('/users-by-role', protect, authorize("admin"), getUsersByRole);
router.get('/users-by-department', protect, authorize("admin"), getUsersByDepartment);

export default router;