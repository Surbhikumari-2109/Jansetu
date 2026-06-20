import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CreateComplaint from "../components/CreateComplaint";
import ComplaintTracker from "../components/ComplaintTracker";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0,
  });

  useEffect(() => {
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
        const res = await axios.get(
          "http://localhost:5000/api/complaints/my-complaints",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const complaints = res.data.complaints;

        setStats({
          total: complaints.length,
          inProgress: complaints.filter((c) => c.status === "in-progress").length,
          resolved: complaints.filter((c) => c.status === "resolved").length,
          pending: complaints.filter(
            (c) => c.status === "pending" || c.status === "assigned"
          ).length,
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

  const handleNewComplaintClick = () => {
    setActiveTab("new");
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById("create-complaint-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleTrackClick = () => {
    setActiveTab("track");
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* TOP NAVIGATION */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
          {/* LOGO */}
          <div className="flex items-center gap-2 py-2 border-r border-slate-700 pr-8">
            <span className="text-xl font-black tracking-tight">
              🏙️ JAN<span className="text-orange-500">SETU</span>
            </span>
          </div>

          {/* CITIZEN PORTAL BADGE (Stays anchored on the top navigation bar natively, untouched) */}
          <div className="flex items-center pl-4 pr-2 sm:px-4">
            <button className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-4 border-orange-500 text-white bg-white/10 sm:bg-white/5">
              👤 Citizen Portal
            </button>
          </div>

          {/* DESKTOP VISIBLE LINKS */}
          <div className="hidden sm:flex items-center space-x-1 flex-1 justify-end pr-4">
            <button
              onClick={handleNewComplaintClick}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors ${
                activeTab === "new" ? "text-white border-b-4 border-slate-600" : ""
              }`}
            >
              + New Complaint
            </button>
            <button
              onClick={handleTrackClick}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors ${
                activeTab === "track" ? "text-white border-b-4 border-slate-600" : ""
              }`}
            >
              Track Status
            </button>
          </div>

          {/* DESKTOP LOGOUT BUTTON */}
          <div className="hidden sm:flex items-center border-l border-slate-700 pl-4">
            <button
              onClick={handleLogout}
              className="px-4 py-4 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* 📱 HAMBURGER ICON FOR PHONES */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-slate-300 hover:text-white focus:outline-none py-2"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE MENU (Fixed dropdown rendering cleanly below the fixed navbar) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col bg-slate-900 border-b border-slate-800 shadow-lg z-[100] fixed top-[56px] left-0 right-0 px-4 py-4 space-y-2 text-white overflow-y-auto max-h-[calc(100vh-56px)]">
          <div className="w-full px-2 pt-1 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-800/50 text-left">
            ⚡ Quick Access
          </div>
          <button
            onClick={handleNewComplaintClick}
            className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-left rounded ${
              activeTab === "new" ? "bg-slate-800 text-orange-500" : ""
            }`}
          >
            + New Complaint
          </button>
          <button
            onClick={handleTrackClick}
            className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-left rounded ${
              activeTab === "track" ? "bg-slate-800 text-orange-500" : ""
            }`}
          >
            Track Status
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-start gap-2 rounded border-t border-slate-800/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* HEADER WITH DYNAMIC NAME CHECK */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Welcome, {userName ? userName : "Citizen"} 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your civic reports and track municipal responses.
          </p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              My Complaints
            </p>
            <h2 className="text-4xl font-black text-slate-900">
              {stats.total}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Total submitted
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-orange-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              In Progress
            </p>
            <h2 className="text-4xl font-black text-slate-900">{stats.inProgress}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Being worked on
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              Resolved
            </p>
            <h2 className="text-4xl font-black text-slate-900">{stats.resolved}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Issues fixed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-red-500 hover:-translate-y-1 transition-transform">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              Pending
            </p>
            <h2 className="text-4xl font-black text-slate-900">{stats.pending}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Awaiting action
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 mb-6 shadow-sm">
          <button
            onClick={handleNewComplaintClick}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === "new"
                ? "bg-slate-50 text-orange-600 shadow border border-slate-100"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            + New Complaint
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === "track"
                ? "bg-slate-50 text-orange-600 shadow border border-slate-100"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Track Status
          </button>
        </div>

        {/* CONTENT AREA WITH SCROLL ID */}
        <div
          id="create-complaint-section"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
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