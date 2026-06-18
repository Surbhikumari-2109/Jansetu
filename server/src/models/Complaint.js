import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },
    images: {
  type: [String],
  default: [],
},

    category: {
      type: String,
      required: true,
      enum: [
        "Road Damage",
        "Garbage Collection",
        "Street Light Issue",
        "Water Leakage",
        "Drainage Problem",
        "Illegal Construction",
        "Public Toilet Issue",
        "Stray Animals",
        "Pollution Complaint",
      ],
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "emergency",
      ],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "assigned",
        "in_progress",
        "completed",
        "verified",
        "closed",
      ],
      default: "pending",
    },

    district: {
      type: String,
      required: true,
    },

    block: {
      type: String,
      required: true,
    },

    ward: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    latitude: Number,

    longitude: Number,

    images: [String],

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    supportCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Complaint",
  complaintSchema
);