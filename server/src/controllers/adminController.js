import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import bcrypt from "bcryptjs";

export const registerOfficial = async (req, res) => {
  try {
    const { fullName, email, contact,password, role, department } = req.body;

    // Validate role
    if (!role || !["officer", "worker", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Official with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create official / worker with department
    const user = await User.create({
      fullName,
      email,
      contact,
      password: hashedPassword,
      role,
      department: role === "worker" ? department : undefined, // Save department only for workers
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: `${role} registered successfully`,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
    const inProgressComplaints = await Complaint.countDocuments({ status: { $in: ["assigned", "in-progress"] } });
    const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });

    const totalCitizens = await User.countDocuments({ role: "citizen" });
    const totalWorkers = await User.countDocuments({ role: "worker" });
    const totalOfficers = await User.countDocuments({ role: "officer" });

    res.status(200).json({
      success: true,
      stats: {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
        },
        users: {
          citizens: totalCitizens,
          workers: totalWorkers,
          officers: totalOfficers,
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error fetching stats" });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" }).select("-password");
    res.status(200).json({ success: true, workers });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching workers", error: error.message });
  }
};

export const getUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    const users = await User.find({ role: role });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUsersByDepartment = async (req, res) => {
  const { department } = req.query;
  try {
    // Sirf us department ke workers ya officers fetch karna
    const users = await User.find({ 
      department: department, 
      role: { $in: ['worker', 'officer'] } 
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};