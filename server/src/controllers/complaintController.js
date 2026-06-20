import Complaint from "../models/Complaint.js";
import generateComplaintId from "../utils/generateComplaintId.js";
import cloudinary from "../config/cloudinary.js";
console.log(cloudinary.config());


export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      district,
      block,
      ward,
      address,
      latitude,
      longitude,
    } = req.body;
    const getDepartmentByCategory = (category) => {
  switch (category) {
    case "Street Light Issue":
      return "Street Light Maintenance";
    case "Road Damage":
      return "Roads & Infrastructure";
    case "Garbage Collection":
      return "Sanitation & Waste Management";
    case "Water Leakage":
      return "Water Supply Board";
    case "Drainage Problem":
      return "Sewage & Drainage Board";
    case "Pollution Complaint":
      return "Public Health & Safety";
    default:
      return "Water Supply Board"; // Default backup department
  }
};
    const departmentName = getDepartmentByCategory(category);

    let images = [];
console.log("Cloudinary Config Test");
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);
console.log("Files received:", req.files?.length);
if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const result = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "jansetu" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer);
      }
    );

    images.push(result.secure_url);
  }
  console.log("Images uploaded:", images);
}
 console.log("Creating complaint...");

   const complaint =
  await Complaint.create({
    complaintId:
      generateComplaintId(),

    title,
    description,
    category,
    department: departmentName,
    district,
    block,
    ward,
    address,

    latitude,
    longitude,

    images,

    citizen: req.user._id,
    
  });
    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
  console.log(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}

};


export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    // 🟢 Step 1: status ke sath-sath req.body se assigneeId ko bhi extract karein
    const { status, assigneeId } = req.body;

    // 🟢 Step 2: Update object banayein jisme agar assigneeId ho toh woh bhi save ho
    const updateData = { status };
    if (assigneeId) {
      updateData.assignedWorker = assigneeId;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData, // n
      { returnDocument: 'after' }
    );

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId, priority } = req.body; // Strip out remarks/resolutionDate if not in model

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      {
        assignedWorker: workerId,
        priority,
        status: "assigned"
      },
      { new: true }
    ).populate("assignedWorker", "fullName email designation department").exec();

    res.status(200).json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllComplaints = async (req, res) => {
  try {
    // Safely populate assignedTo, falling back gracefully if the worker record is missing
    const complaints = await Complaint.find()
      .populate({
        path: "assignedWorker",
        select: "fullName email designation department",
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Detailed Error in getAllComplaints:", error); // ⬅️ Ensures error logs clearly in terminal
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🛠️ Fetch tasks specifically for the logged-in worker
export const getWorkerTasks = async (req, res) => {
  try {
    const workerId = req.user._id;

    const complaints = await Complaint.find({ assignedWorker: workerId })
      .populate("assignedWorker", "fullName email designation department")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🛠️ Update operational status and progress notes by the worker
export const updateWorkerProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progressNote } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { 
        status, 
        progressNote 
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      complaint: updatedComplaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Functn jo database se users nikal kar layega
export const getUsersByRole = async (req, res) => {
  const { role } = req.query;
  try {
    const users = await User.find({ role: role });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};