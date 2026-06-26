import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, 
  LogOut, 
  ClipboardList, 
  Hourglass, 
  CheckCircle2, 
  AlertCircle, 
  Menu, 
  X, 
  PlusCircle, 
  Search,
  UserCircle 
} from "lucide-react";
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
          "https://jansetu-eta0.onrender.com/api/complaints/my-complaints",
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
    alert("Thank you, Visit again!");
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
          {/* LOGO WITH REACT ICON */}
          <div className="flex items-center gap-2 py-2 border-r border-slate-700 pr-8">
            <Building2 className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-black tracking-tight">
              JAN<span className="text-orange-500">SETU</span>
            </span>
          </div>

          {/* CITIZEN PORTAL BADGE (Stays anchored on the top navigation bar natively) */}
          <div className="flex items-center pl-4 pr-2 sm:px-4">
            <button className="px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-4 text-white bg-white/10 sm:bg-white/5 flex items-center gap-2 rounded">
              <UserCircle className="h-4 w-4" />
              <span>Citizen Panel</span>
            </button>
          </div>

          {/* DESKTOP VISIBLE LINKS */}
          <div className="hidden sm:flex items-center space-x-1 flex-1 justify-end pr-4">
            <button
              onClick={handleNewComplaintClick}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors flex items-center gap-2 ${
                activeTab === "new" ? "text-white border-b-4 border-slate-600" : ""
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Complaint</span>
            </button>
            <button
              onClick={handleTrackClick}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors flex items-center gap-2 ${
                activeTab === "track" ? "text-white border-b-4 border-slate-600" : ""
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Track Status</span>
            </button>
          </div>

          {/* DESKTOP LOGOUT BUTTON */}
          <div className="hidden sm:flex items-center border-l border-slate-700 pl-4">
            <button
              onClick={handleLogout}
              className="px-4 py-4 text-sm font-bold uppercase tracking-wider border-b-4 border-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* HAMBURGER ICON FOR PHONES */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-slate-300 hover:text-white focus:outline-none py-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col bg-slate-900 border-b border-slate-800 shadow-lg z-[100] fixed top-[56px] left-0 right-0 px-4 py-4 space-y-2 text-white overflow-y-auto max-h-[calc(100vh-56px)]">
          <div className="w-full px-2 pt-1 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-800/50 text-left">
            ⚡ Quick Access
          </div>
          <button
            onClick={handleNewComplaintClick}
            className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-left flex items-center gap-3 rounded ${
              activeTab === "new" ? "bg-slate-800 text-orange-500" : ""
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Complaint</span>
          </button>
          <button
            onClick={handleTrackClick}
            className={`w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-left flex items-center gap-3 rounded ${
              activeTab === "track" ? "bg-slate-800 text-orange-500" : ""
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Track Status</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-start gap-3 rounded border-t border-slate-800/60"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* HEADER WITH PROFESSIONAL REACT ICON GREETING */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <span>Welcome, {userName ? userName : "Citizen"}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage your civic reports and track municipal responses.
          </p>
        </div>

        {/* STATS ROW WITH PROFESSIONAL ICONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">My Complaints</p>
              <ClipboardList className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">{stats.total}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Total submitted</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-orange-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">In Progress</p>
              <Hourglass className="h-5 w-5 text-orange-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">{stats.inProgress}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Being worked on</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Resolved</p>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">{stats.resolved}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Issues fixed</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 border-t-4 border-t-red-500 hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Pending</p>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-900">{stats.pending}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Awaiting action</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 mb-6 shadow-sm">
          <button
            onClick={handleNewComplaintClick}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "new"
                ? "bg-slate-50 text-orange-600 shadow border border-slate-100"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Complaint</span>
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "track"
                ? "bg-slate-50 text-orange-600 shadow border border-slate-100"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Track Status</span>
          </button>
        </div>

        {/* CONTENT AREA */}
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