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
    department: {
    type: String,
    required: true,
    enum: [
      "Water Supply Board",
      "Sanitation & Waste Management",
      "Roads & Infrastructure",
      "Electrical Maintenance",
      "Parks & Public Gardens",
      "Sewage & Drainage Board",
      "Public Health & Safety",
      "Street Light Maintenance",
      "Civil Supplies & Distribution",
      "Disaster Management Cell"
    ]
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
        "assigned",
        "in_progress",
        "completed",
      ],
      default: "pending",
    },
  progressNote: {
  type: String,
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

    pincode: Number,

    

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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Complaint",
  complaintSchema
);