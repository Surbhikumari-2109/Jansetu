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
      enum: [
        "citizen",
        "officer",
        "worker",
        "admin",
      ],
      default: "citizen",
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
    department: {
  type: String,
  required: function() { return this.role === 'worker'; }, // Workers ke liye compulsory kar dein
},
contact: { type: String, required: true },

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
  }
);

export default mongoose.model("User", userSchema);