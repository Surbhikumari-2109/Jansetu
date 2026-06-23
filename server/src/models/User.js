import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["citizen", "officer", "worker", "admin"],
      default: "citizen",
    },

    // Added a specific employee or official identifier field
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
    },

    district: {
      type: String,
    },

    block: {
      type: String,
    },

    // Department required for both officials and ground staff
    department: {
      type: String,
      required: function () {
        return this.role === "worker";
      },
    },
    ward: {
      type: String,
      required: function () {
        return this.role === "officer";
      },
    },

    contact: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
