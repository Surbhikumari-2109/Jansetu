import { useState, useEffect } from "react";
import axios from "axios";

const ComplaintTracker = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/complaints/my-complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComplaints(res.data.complaints);
      
      if (res.data.complaints.length > 0) {
        setSelectedComplaint(res.data.complaints[0]); 
      }
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-red-50 text-red-600 border-red-200';
      case 'assigned': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'in-progress': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStepStatus = (currentStatus, stepName) => {
    const statuses = ['pending', 'assigned', 'in-progress', 'resolved'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(stepName);
    
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'upcoming';
  };

  if (isLoading) {
    return <div className="text-center py-20 font-bold text-slate-500 animate-pulse">Loading your reports...</div>;
  }

  if (complaints.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <span className="text-5xl mb-4 block">📭</span>
        <h3 className="text-xl font-black text-slate-800 mb-2">No complaints found</h3>
        <p className="text-slate-500 font-medium">You haven't reported any civic issues yet. Head over to the 'New Complaint' tab to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 text-slate-900">
      
      {/* LEFT COLUMN: LIST OF COMPLAINTS */}
      <div className="md:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 pl-1">Your Reports</h3>
        {complaints.map((c) => (
          <div 
            key={c._id}
            onClick={() => setSelectedComplaint(c)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedComplaint?._id === c._id 
                ? 'border-orange-500 bg-orange-50 shadow-sm' 
                : 'border-slate-100 bg-white hover:border-orange-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <span className="text-xs font-black text-slate-400">{c.complaintId || 'ID Pending'}</span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${getStatusStyle(c.status)}`}>
                {c.status}
              </span>
            </div>
            <h4 className="font-bold text-sm line-clamp-1 mb-1">{c.title}</h4>
            <p className="text-xs text-slate-500 font-medium">{new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN: TIMELINE DETAILS */}
      <div className="md:col-span-2">
        {selectedComplaint && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 h-full">
            
            <div className="mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                 <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-500 shadow-sm">
                   {selectedComplaint.category}
                 </span>
                 <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-500 shadow-sm">
                   📍 {selectedComplaint.ward}, {selectedComplaint.block}
                 </span>
              </div>
              <h2 className="text-2xl font-black mb-3">{selectedComplaint.title}</h2>
              <p className="text-slate-600 font-medium leading-relaxed">{selectedComplaint.description}</p>
              
              {/* Evidence Photos */}
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div className="mt-6 flex gap-3 flex-wrap">
                  {selectedComplaint.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt="Evidence" 
                      onClick={() => setSelectedImage(img)} 
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:scale-105 transition-all" 
                    />
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-6">Resolution Timeline</h3>
            
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-10 pb-4">
              
              {/* STEP 1: PENDING */}
              <div className="relative pl-8">
                <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-slate-50 ${getStepStatus(selectedComplaint.status, 'pending') === 'completed' ? 'bg-emerald-500' : 'bg-orange-500 shadow-sm'}`}></div>
                <h4 className="font-bold text-slate-900">Complaint Submitted</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Your issue has been received and is pending review.</p>
              </div>

              {/* STEP 2: ASSIGNED */}
              <div className="relative pl-8">
                <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-slate-50 ${getStepStatus(selectedComplaint.status, 'assigned') === 'completed' ? 'bg-emerald-500' : getStepStatus(selectedComplaint.status, 'assigned') === 'active' ? 'bg-orange-500 shadow-sm' : 'bg-slate-200'}`}></div>
                <h4 className={`font-bold ${getStepStatus(selectedComplaint.status, 'assigned') === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>Assigned to Department</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Routed to the appropriate municipal officer.</p>
              </div>

              {/* STEP 3: IN PROGRESS */}
              <div className="relative pl-8">
                <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-slate-50 ${getStepStatus(selectedComplaint.status, 'in-progress') === 'completed' ? 'bg-emerald-500' : getStepStatus(selectedComplaint.status, 'in-progress') === 'active' ? 'bg-orange-500 shadow-[0_0_0_4px_rgba(234,88,12,0.15)]' : 'bg-slate-200'}`}></div>
                <h4 className={`font-bold ${getStepStatus(selectedComplaint.status, 'in-progress') === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>Work in Progress</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Field workers have begun resolving the issue on-site.</p>
              </div>

              {/* STEP 4: RESOLVED */}
              <div className="relative pl-8">
                <div className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-slate-50 ${getStepStatus(selectedComplaint.status, 'resolved') === 'active' ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]' : 'bg-slate-200'}`}></div>
                <h4 className={`font-bold ${getStepStatus(selectedComplaint.status, 'resolved') === 'upcoming' ? 'text-slate-400' : 'text-emerald-600'}`}>Resolved</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">The issue has been successfully fixed.</p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ❌ FULLSCREEN LIGHTBOX MODAL (Close Button Fixed to Screen Top-Right) */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          {/* SCREEN TOP RIGHT CORNER ABSOLUTE CLOSE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="fixed top-4 right-4 z-[60] bg-white text-slate-900 w-12 h-12 rounded-full font-black text-xl flex items-center justify-center shadow-2xl hover:scale-110 border-2 border-slate-200 transition-all cursor-pointer"
          >
            ✕
          </button>

          <div className="relative max-w-5xl w-full flex justify-center">
            <img
              src={selectedImage}
              alt="Enlarged evidence"
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ComplaintTracker;