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
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
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

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

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
