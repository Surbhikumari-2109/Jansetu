import Complaint from '../models/Complaint.js';

export const getSystemStats = async (req, res) => {
  try {
    // Total issues submitted
    const total = await Complaint.countDocuments();
    
    // Issues resolved (Match exactly with database value, e.g., "resolved")
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    
    // Being worked on (Match exactly with database value, e.g., "in-progress")
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    
    // Pending issues (Match exactly with database value, e.g., "pending")
    const pending = await Complaint.countDocuments({ status: 'pending' });

    // Resolution rate calculation
    const satisfaction = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        resolved,
        inProgress,
        pending,
        satisfaction: `${satisfaction}%`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};