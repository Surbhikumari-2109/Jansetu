import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Building2, LogOut, ListOrdered,UserCircle,Zap,Menu,X} from 'lucide-react';

const OfficerDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userName, setUserName] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [officerWard, setOfficerWard] = useState("Municipal Staff");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [workers, setWorkers] = useState([]);
  const [activeComplaint, setActiveComplaint] = useState(null);

  const [priority, setPriority] = useState("Medium");
  const [department, setDepartment] = useState("");
  const [assignedWorkerId, setAssignedWorkerId] = useState("");
  const [resolutionDate, setResolutionDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/complaints/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(res.data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints", error);
      setComplaints([]);
    }
  };

  const fetchWorkers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/workers",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkers(res.data.workers || []);
    } catch (error) {
      console.error("Failed to fetch workers", error);
      setWorkers([]);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.fullName || userObj.name || "");
        
        // Dynamically retrieving profile identifier
        const parsedId = userObj.employeeId || userObj.id || userObj._id || "";
        setOfficerId(parsedId ? parsedId.slice(-8).toUpperCase() : "OFF-T-047");
        
        if (userObj.ward || userObj.division) {
          setOfficerWard(`Ward ${userObj.ward || userObj.division}`);
        } else if (userObj.district) {
          setOfficerWard(`${userObj.district} Staff`);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        setOfficerId("OFF-ERR-047");
      }
    }
    fetchComplaints();
    fetchWorkers();
  }, []);

  const handleSelectComplaint = (complaint) => {
    setActiveComplaint(complaint);
    setPriority(complaint.priority || "Medium");
    setDepartment(complaint.department || "");
    setAssignedWorkerId(complaint.assignedTo?._id || "");
    setRemarks(complaint.remarks || "");
    
    if (complaint.expectedResolution) {
      setResolutionDate(new Date(complaint.expectedResolution).toISOString().split('T')[0]);
    } else {
      setResolutionDate("");
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    if (!assignedWorkerId) return alert("Please select a worker.");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/complaints/${activeComplaint._id}/assign`,
        { 
          workerId: assignedWorkerId,
          priority,
          department,
          resolutionDate,
          remarks
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task successfully assigned to field worker!");
      setActiveComplaint(null);
      fetchComplaints();
    } catch (error) {
      alert(error.response?.data?.message || "Assignment failed.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
      if (activeComplaint && activeComplaint._id === id) {
        setActiveComplaint({ ...activeComplaint, status });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredComplaints = complaints?.filter((complaint) => {
    const matchesSearch =
      complaint?.title?.toLowerCase().includes(search.toLowerCase()) ||
      complaint?.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : complaint?.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const unassignedCount = complaints.filter(c => c?.status === "pending").length;
  const inProgressCount = complaints.filter(c => c?.status === "in-progress" || c?.status === "assigned").length;
  
  // Total Resolved (All resolved complaints instead of today-only resolution)
  const totalResolvedCount = complaints.filter(c => c?.status === "resolved").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* PREMIUM OFFICER DASHBOARD NAVBAR */}
      <nav className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 py-0.5 border-r border-slate-700/60 pr-4 sm:pr-8">
            <Building2 className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-black tracking-tight flex items-center gap-1.5 text-white leading-none">
              JAN<span className="text-orange-500">SETU</span>
            </span>
          </div>

          {/* Right Section: Desktop Visible Portal Badge + Logout Button */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 rounded-lg border border-orange-800/40 hidden sm:flex items-center gap-2 whitespace-nowrap">
              <UserCircle className="h-5 w-5" />
              Officer Panel
            </span>
            
            <button
              onClick={handleLogout}
              className="px-3 py-2 sm:px-5 sm:py-2.5 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 sm:gap-2 rounded-lg cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-slate-300 hover:text-white focus:outline-none p-1.5 rounded-lg border border-slate-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col bg-[#0f172a] border-b border-slate-800 shadow-2xl z-[100] fixed top-[72px] left-0 right-0 px-6 py-4 space-y-3 text-white w-full border-t border-slate-800/40">
          <span className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 rounded-lg border border-orange-800/30 flex items-center gap-3 justify-start">
            <UserCircle className="h-4 w-4" /> Officer Portal
          </span>

          <div className="w-full pt-1 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-800/50 text-left flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>Quick Access</span>
          </div>

          <a 
            href="#pending-complaints-title" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2.5 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-left border-b border-slate-800/30 flex items-center gap-3 rounded"
          >
            <ListOrdered className="h-4 w-4" /> Pending Issues
          </a>

          <button 
            onClick={handleLogout} 
            className="w-full py-2.5 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-start gap-3 rounded border-t border-slate-800/60"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-1">
            Municipal Officer Dashboard
          </h1>
          <p className="text-slate-500 font-bold text-sm">
           {userName ? userName : "Mr. Sitaraman Singh "} | {officerWard} , Officer ID: {officerId}
          </p>
        </div>

        {/* 4-COLUMN PREMIUM STATS ROW W/ PRECISE BORDER ACCENTS LIKE CITIZEN DASHBOARD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500 border-t border-r border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unassigned</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{unassignedCount}</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">Needs action now</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-orange-400 border-t border-r border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{inProgressCount}</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">Being handled</p>
          </div>

          {/*  STAT CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-emerald-500 border-t border-r border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Resolved</p>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">{totalResolvedCount}</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-slate-400 border-t border-r border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total This Month</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{complaints.length}</h2>
            <p className="text-xs text-slate-500 font-bold mt-1">All complaints</p>
          </div>
        </div>

        {/* STRUCTURAL LAYOUT */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: PENDING COMPLAINTS LIST */}
          <div className="space-y-6 w-full">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by title or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm font-semibold text-sm bg-slate-50"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm font-semibold text-sm bg-slate-50 min-w-[180px]"
              >
                <option value="all">View All Status</option>
                <option value="pending"> Pending</option>
                <option value="assigned"> Assigned</option>
                <option value="in-progress"> In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <h2 id="pending-complaints-title" className="text-xl font-black">Pending Complaints</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-black px-2.5 py-0.5 rounded-full">
                {unassignedCount} urgent
              </span>
            </div>

            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                  <p className="text-slate-500 font-bold">No complaints found matching criteria.</p>
                </div>
              ) : (
                filteredComplaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    onClick={() => handleSelectComplaint(complaint)}
                    className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 cursor-pointer hover:border-orange-400 transition-all relative overflow-hidden ${
                      activeComplaint?._id === complaint._id ? "ring-2 ring-orange-500/60" : ""
                    } ${
                      complaint.status === 'pending' ? 'border-l-4 border-l-red-500' :
                      complaint.status === 'assigned' ? 'border-l-4 border-l-blue-500' :
                      complaint.status === 'in-progress' ? 'border-l-4 border-l-orange-500' :
                      'border-l-4 border-l-emerald-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                          {complaint.complaintId}
                        </span>
                        {/* VIBRANT STATUS BADGES */}
                        <span className={`ml-2 text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${
                          complaint.status === 'pending' ? 'bg-red-100 text-red-600' :
                          complaint.status === 'assigned' ? 'bg-blue-100 text-blue-600' :
                          complaint.status === 'in-progress' ? 'bg-orange-100 text-orange-600' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      <span className="text-xs font-black uppercase text-slate-400 bg-slate-50 border px-2.5 py-1 rounded-lg">
                        {complaint.priority || "MEDIUM"}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mt-1">{complaint.title}</h3>
                    <p className="text-orange-600 font-black text-xs uppercase tracking-wider mb-3">{complaint.category}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-500">
                      <span>📍 {complaint.ward}, {complaint.district}</span>
                      <span>🕒 {new Date(complaint.createdAt).toLocaleDateString("en-GB")}</span>
                    </div>

                    {complaint.status !== "pending" && (complaint.assignedTo || complaint.assignedWorker) && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-bold">
                         Assigned Ground Staff: 
                        <span className="text-orange-600 font-black tracking-wide">
                          {complaint.assignedWorker?.fullName || complaint.assignedTo?.fullName || "Assigned Executive"}
                        </span>
                      </div>
                    )}

                    {complaint.images && complaint.images.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                        {complaint.images.slice(0,3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="evidence"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                            className="w-10 h-10 object-cover rounded-xl border border-slate-200 cursor-pointer hover:scale-105 transition-all"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ASSIGNMENT / MANAGING CONTAINER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28 w-full h-fit">
            {activeComplaint ? (
              <div>
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center mb-4">
                  <h2 className="text-base font-extrabold text-slate-900">
                    {activeComplaint.status === "pending" ? "Assign & Manage" : "Complaint Details"} — {activeComplaint.complaintId}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveComplaint(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* READONLY METADATA */}
                <div className="grid grid-cols-2 gap-4 text-xs font-bold bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5">
                  <div>
                    <p className="text-slate-400 uppercase mb-0.5">Category</p>
                    <p className="text-slate-800">{activeComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase mb-0.5">Location</p>
                    <p className="text-slate-800 truncate">{activeComplaint.ward}, {activeComplaint.district}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase mb-0.5">Submitted</p>
                    <p className="text-slate-800">{new Date(activeComplaint.createdAt).toLocaleString('en-GB', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase mb-0.5">Citizen</p>
                    <p className="text-slate-800 truncate">{activeComplaint.citizen?.fullName || "Citizen Report"}</p>
                  </div>
                </div>

                {/* WORKER ROUTE/ASSIGNMENT PANEL CONTAINING 9 DEPARTMENTS */}
                {activeComplaint.status === "pending" ? (
                  <form onSubmit={handleAssignTask} className="space-y-5">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
                        Set Priority
                      </label>
                      <div className="flex gap-4">
                        {["High", "Medium", "Low"].map((lvl) => (
                          <label key={lvl} className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value={lvl}
                              checked={priority === lvl}
                              onChange={(e) => setPriority(e.target.value)}
                              className="w-4 h-4 accent-orange-500"
                            />
                            {lvl}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        Assign To Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold text-xs bg-white outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                      >
                        <option value="">Select Department</option>
                        <option value="Water Supply Board">Water Supply Board</option>
                    <option value="Sanitation & Waste Management">Sanitation & Waste Management</option>
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Electrical Maintenance">Electrical Maintenance</option>
                    <option value="Parks & Public Gardens">Parks & Public Gardens</option>
                    <option value="Sewage & Drainage Board">Sewage & Drainage Board</option>
                    <option value="Public Health & Safety">Public Health & Safety</option>
                    <option value="Street Light Maintenance">Street Light Maintenance</option>
                    <option value="Civil Supplies & Distribution">Civil Supplies & Distribution</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        Assign Worker 
                      </label>
                      <select
                        value={assignedWorkerId}
                        onChange={(e) => setAssignedWorkerId(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold text-xs bg-white outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                      >
                        <option value="">-- Choose Matching Field Worker --</option>
                        {workers
                          .filter((w) => w.department === department)
                          .map((w) => (
                            <option key={w._id} value={w._id}>
                              {w.fullName} — {w.department}
                            </option>
                          ))}
                      </select>
                      {department && workers.filter((w) => w.department === department).length === 0 && (
                        <p className="text-red-600 font-bold text-xs mt-1">
                           No workers available for this department!
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        Expected Resolution Date
                      </label>
                      <input
                        type="date"
                        value={resolutionDate}
                        onChange={(e) => setResolutionDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold text-xs bg-white outline-none focus:ring-2 focus:ring-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        Officer Remarks
                      </label>
                      <textarea
                        rows="3"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add specific remarks or inspection instructions..."
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-semibold text-xs outline-none focus:ring-2 focus:ring-orange-500/50"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={!assignedWorkerId}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-black text-xs transition-all disabled:bg-slate-300 shadow-sm cursor-pointer"
                    >
                       Assign Now
                    </button>
                  </form>
                ) : activeComplaint.status === "resolved" ? (
                  /*  COMPLAINT RESOLVED - DISPLAY READONLY DETAILS EXCLUSIVELY */
                  <div className="space-y-4">              
                     {/* Display assigned worker metadata for resolved task inspection */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider"> Ground Staff Involved</h4>
                      <div className="text-xs font-bold text-slate-700 space-y-1">
                        <p><span className="text-slate-400 uppercase">Name:</span> {activeComplaint.assignedWorker?.fullName || activeComplaint.assignedTo?.fullName || "N/A"}</p>
                        <p><span className="text-slate-400 uppercase">Department:</span> {activeComplaint.assignedWorker?.department || activeComplaint.assignedTo?.department || "N/A"}</p>
                      </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                      <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">Complaint has been successfully resolved and closed.</p>
                    </div>
                  </div>
                ) : (
                  /*  ASSIGNED/IN-PROGRESS -> DISPLAY WORKER PROPERTIES & RESOLVE ACTIONS ONLY */
                  <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl space-y-3">
                      <h4 className="text-xs font-black text-orange-800 uppercase tracking-wider"> Ground Staff Details</h4>
                      <div className="text-xs font-bold text-slate-700 space-y-1.5">
                        <p><span className="text-slate-400 uppercase">Name:</span> {activeComplaint.assignedWorker?.fullName || activeComplaint.assignedTo?.fullName || "N/A"}</p>
                        <p><span className="text-slate-400 uppercase">Designation:</span> {activeComplaint.assignedWorker?.designation || activeComplaint.assignedTo?.designation || "Field Executive"}</p>
                        <p><span className="text-slate-400 uppercase">Email:</span> {activeComplaint.assignedWorker?.email || activeComplaint.assignedTo?.email || "N/A"}</p>
                        <p><span className="text-slate-400 uppercase">Department:</span> {activeComplaint.assignedWorker?.department || activeComplaint.assignedTo?.department || "N/A"}</p>  
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => updateStatus(activeComplaint._id, "resolved")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-black text-xs transition-all shadow-sm cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold">
                Select an issue card from the left panel to display assignment properties.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
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

export default OfficerDashboard;