import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      district,
      block,
      role,
      department,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      district,
      block,
      role: role || "citizen", // Default to citizen if no role provided
      department: role === "worker" ? department : undefined, // Only save department if the user is a worker
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  console.log("Login attempt received for:", req.body.email);
  try {
    // Added portalType to check where the login is coming from
    const { email, password, portalType } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --- NEW: Security Check for Official Portal ---
    const isOfficialPortal = portalType === "official";
    const isOfficialUser = ["officer", "admin", "worker"].includes(user.role);
    if (isOfficialPortal && !isOfficialUser) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have official credentials.",
      });
    }
    // -----------------------------------------------

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
