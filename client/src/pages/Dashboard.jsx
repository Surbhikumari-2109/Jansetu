import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CreateComplaint from "../components/CreateComplaint";
import ComplaintTracker from "../components/ComplaintTracker";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [userName, setUserName] = useState(""); 
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0
  });

  useEffect(() => {
    // Fetch Name safely from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.fullName || userObj.name || "");
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/complaints/my-complaints", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const complaints = res.data.complaints;
        
        setStats({
          total: complaints.length,
          inProgress: complaints.filter(c => c.status === "in-progress").length,
          resolved: complaints.filter(c => c.status === "resolved").length,
          pending: complaints.filter(c => c.status === "pending" || c.status === "assigned").length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
  }, [activeTab]);

  const handleLogout = () => {
    alert("Thank you, Visit again! 🏙️");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🟢 Smooth scroll function for "+ New Complaint" button
  const handleNewComplaintClick = () => {
    setActiveTab("new");
    setTimeout(() => {
      const element = document.getElementById("create-complaint-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      
      {/* TOP NAVIGATION */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="flex items-center gap-2 py-4 border-r border-slate-700 pr-8">
            <span className="text-xl font-black tracking-tight">🏙️ JAN<span className="text-orange-500">SETU</span></span>
          </div>
          
          {/* NAVIGATION LINKS & ICONS */}
          <div className="flex items-center space-x-1 px-4 overflow-x-auto">
            <button className="px-6 py-4 text-sm font-bold uppercase tracking-wider border-b-4 border-orange-500 text-white bg-white/10">
              👤 Citizen Portal
            </button>
            
            {/* LOGOUT ICON BUTTON (Top Right Corner) */}
            <button 
              onClick={handleLogout} 
              className="px-4 py-4 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* HEADER WITH DYNAMIC NAME CHECK */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Welcome, {userName ? userName : "Citizen"} 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your civic reports and track municipal responses.</p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">My Complaints</p>
            <h2 className="text-4xl font-black text-slate-900">{stats.total}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Total submitted</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-orange-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">In Progress</p>
            <h2 className="text-4xl font-black text-slate-900">{stats.inProgress}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Being worked on</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Resolved</p>
            <h2 className="text-4xl font-black text-slate-900">{stats.resolved}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Issues fixed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-red-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Pending</p>
            <h2 className="text-4xl font-black text-slate-900">{stats.pending}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Awaiting action</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 mb-6 shadow-sm">
          <button 
            onClick={handleNewComplaintClick}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === "new" ? "bg-slate-50 text-orange-600 shadow border border-slate-100" : "text-slate-500 hover:bg-slate-50"}`}
          >
            + New Complaint
          </button>
          <button 
            onClick={() => setActiveTab("track")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === "track" ? "bg-slate-50 text-orange-600 shadow border border-slate-100" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Track Status
          </button>
        </div>

        {/* CONTENT AREA WITH SCROLL ID */}
        <div id="create-complaint-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {activeTab === "new" && <CreateComplaint />}
          {activeTab === "track" && (
            <div className="p-8">
              <ComplaintTracker />
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;