import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    contact: '', 
    password: '', 
    role: 'worker', 
    department: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  
  // Active selection state for side-panel detail review
  const [activeComplaint, setActiveComplaint] = useState(null);
  
  // Mobile Menu Visibility State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States for Clickable Directory Modal
  const [isDirModalOpen, setIsDirModalOpen] = useState(false);
  const [dirModalTitle, setDirModalTitle] = useState('');
  const [dirUsersList, setDirUsersList] = useState([]);
  const [isDirLoading, setIsDirLoading] = useState(false);

  // States for Department-based assignment
  const [deptUsers, setDeptUsers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setStats(statsRes.data.stats);

      const compRes = await axios.get('http://localhost:5000/api/complaints/all', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setComplaints(compRes.data.complaints || []);
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setAdminName(userObj.fullName || userObj.name || 'Admin');
      } catch (e) {
        console.error(e);
      }
    }
    fetchAdminData();
  }, []);

  // Jab bhi complaint select ho, uske department ke workers/officers fetch karein
  useEffect(() => {
    const fetchDeptAssignees = async () => {
      if (!activeComplaint || !activeComplaint.department) {
        setDeptUsers([]);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/users-by-department?department=${encodeURIComponent(activeComplaint.department)}`, {
          headers: { Authorization: 'Bearer ' + token }
        });
        setDeptUsers(res.data.users || []);
        setSelectedAssignee('');
      } catch (err) {
        console.error('Failed to fetch department assignees', err);
        setDeptUsers([]);
      }
    };
    
    fetchDeptAssignees();
  }, [activeComplaint]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.role === 'worker' && !formData.department) {
      alert('Please assign a department for the field worker.');
      return;
    }

    if (!formData.contact) {
      alert('Contact number is required.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/register-official', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      alert('Official registered successfully!');
      setFormData({ fullName: '', email: '', contact: '', password: '', role: 'worker', department: '' });
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

 const handleAssignResolve = async (id, nextStatus, assigneeId = '') => {
    try {
      const token = localStorage.getItem('token');
      const payload = { status: nextStatus };
      if (assigneeId) payload.assigneeId = assigneeId;

      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, payload, {
        headers: { Authorization: 'Bearer ' + token }
      });
      alert(`Complaint status updated to ${nextStatus}`);
      fetchAdminData();
      if (activeComplaint && activeComplaint._id === id) {
        setActiveComplaint({ ...activeComplaint, status: nextStatus });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };
  // Function to call API & populate the custom modal list
  const showUserDirectoryModal = async (roleType, titleLabel) => {
    setIsDirLoading(true);
    setDirModalTitle(titleLabel);
    setIsDirModalOpen(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/users-by-role?role=${roleType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDirUsersList(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch directory list details', err);
      alert('Could not load directory details for this user category.');
    } finally {
      setIsDirLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* TOP NAVIGATION W/ RESPONSIVE COLLAPSIBLE HAMBURGER ICON */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2 md:py-0">
          <div className="flex items-center gap-2 py-4 border-r border-slate-700 pr-8">
            <span className="text-xl font-black tracking-tight">🏙️ JAN<span className="text-orange-500">SETU</span></span>
          </div>

          {/* HAMBURGER MENU ICON (Visible on mobile screens) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none p-2 rounded-lg hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Actions */}
          <div className="hidden md:flex items-center space-x-1 px-4">
            <span className="px-4 py-4 text-sm font-bold uppercase tracking-wider text-orange-400 bg-orange-950/30 rounded-lg">
              ⚡ Super Admin Panel
            </span>
            <button 
              onClick={handleLogout} 
              className="px-4 py-4 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* EXPANDABLE MOBILE DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 px-6 py-4 space-y-4 border-t border-slate-700 shadow-inner">
            <div className="flex flex-col space-y-3 pb-3 border-b border-slate-700">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Direct Function Access</span>
               <a href="#system-metrics" className="text-slate-300 font-bold text-xs uppercase py-1.5 hover:text-orange-400" onClick={() => setIsMobileMenuOpen(false)}>System Status</a>
               <a href="#database-reg" className="text-slate-300 font-bold text-xs uppercase py-1.5 hover:text-orange-400" onClick={() => setIsMobileMenuOpen(false)}>Database Directory</a>
               <a href="#staff-onboard" className="text-slate-300 font-bold text-xs uppercase py-1.5 hover:text-orange-400" onClick={() => setIsMobileMenuOpen(false)}>Staff Registration</a>
               <a href="#active-issues" className="text-slate-300 font-bold text-xs uppercase py-1.5 hover:text-orange-400" onClick={() => setIsMobileMenuOpen(false)}>Issues Review</a>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2">
              <span className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-orange-400 bg-orange-950/40 rounded-lg">
                ⚡ Super Admin Panel
              </span>
              <button 
                onClick={handleLogout} 
                className="text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Control Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Overseeing city-wide modules, municipal officers, and field systems.</p>
        </div>

        {/* METRICS / STATS CARDS */}
        {stats && (
          <div id="system-metrics" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total System Reports</span>
              <h2 className="text-4xl font-black mt-2 text-slate-900">{complaints.length}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-red-500">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unassigned / Pending</span>
              <h2 className="text-4xl font-black mt-2 text-slate-900">{complaints.filter(c => c.status === "pending").length}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-orange-500">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress/Assigned</span>
              <h2 className="text-4xl font-black mt-2 text-slate-900">{complaints.filter(c => c.status === "in-progress" || c.status === "assigned").length}</h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Issues</span>
              <h2 className="text-4xl font-black mt-2 text-slate-900">{complaints.filter(c => c.status === "resolved").length}</h2>
            </div>
          </div>
        )}

        <div id="database-reg" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* CLICKABLE DATABASE REGISTRATIONS */}
          {stats && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">Database Registrations</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => showUserDirectoryModal('citizen', '👥 Registered Citizens Directory')}
                  className="w-full flex justify-between items-center bg-slate-50 p-4 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-200 cursor-pointer"
                >
                  <span className="font-bold text-sm text-slate-600">Citizens Registered</span>
                  <span className="font-black text-slate-900">{stats.users.citizens}</span>
                </button>
                <button 
                  onClick={() => showUserDirectoryModal('officer', '👥 Municipal Officers Directory')}
                  className="w-full flex justify-between items-center bg-slate-50 p-4 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-200 cursor-pointer"
                >
                  <span className="font-bold text-sm text-slate-600">Municipal Officers</span>
                  <span className="font-black text-slate-900">{stats.users.officers}</span>
                </button>
                <button 
                  onClick={() => showUserDirectoryModal('worker', '👥 Field Workers Directory')}
                  className="w-full flex justify-between items-center bg-slate-50 p-4 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-200 cursor-pointer"
                >
                  <span className="font-bold text-sm text-slate-600">Field Workers</span>
                  <span className="font-black text-slate-900">{stats.users.workers}</span>
                </button>
              </div>
            </div>
          )}

          {/* REGISTER STAFF ACCOUNT FORM */}
          <div id="staff-onboard" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-xl font-black text-slate-900 mb-2">➕ Register Staff Account</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Create operational administrative profiles for officers or field ground-staff.</p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none" 
                  placeholder="e.g. Rajesh Kumar" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email / Official Handle</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none" 
                  placeholder="officer@jansetu.gov.in" 
                />
              </div>

              {/* Contact Number Field */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Contact No.</label>
                <input 
                  type="tel" 
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none" 
                  placeholder="e.g. 9876543210" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Secure Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none" 
                  placeholder="••••••••" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assign Clearance Role</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-white"
                >
                  <option value="worker">Field Worker</option>
                  <option value="officer">Municipal Officer</option>
                  <option value="admin">System Super Admin</option>
                </select>
              </div>

              {/* FIELD WORKER DEPARTMENT DROPDOWN */}
              {formData.role === 'worker' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assign to Department</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-white"
                    required
                  >
                    <option value="">-- Select Department --</option>
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
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                {isLoading ? 'Registering Official...' : 'Register Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* DATA DIRECTORY MODAL POPUP */}
        {isDirModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
               <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-xl font-black text-slate-900">{dirModalTitle}</h3>
                  <button 
                     onClick={() => setIsDirModalOpen(false)}
                     className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2.5 rounded-xl outline-none cursor-pointer"
                  >
                     ✕
                  </button>
               </div>
               
               <div className="overflow-y-auto flex-1 pr-1 max-h-[60vh]">
                  {isDirLoading ? (
                     <p className="text-sm font-bold text-slate-400 text-center py-12">Loading records...</p>
                  ) : dirUsersList.length === 0 ? (
                     <p className="text-sm font-bold text-slate-400 text-center py-12">No records found for this directory category.</p>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-wider border-y border-slate-100">
                                 <th className="py-4 px-4">Full Name</th>
                                 <th className="py-4 px-4">Email Address</th>
                                 <th className="py-4 px-4">Contact</th>
                                 {dirUsersList[0]?.department && <th className="py-4 px-4">Department</th>}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                              {dirUsersList.map((u) => (
                                 <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 font-black text-slate-900">{u.fullName}</td>
                                    <td className="py-4 px-4 text-slate-500">{u.email}</td>
                                    <td className="py-4 px-4">{u.contact || 'N/A'}</td>
                                    {u.department && <td className="py-4 px-4">{u.department}</td>}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* Active Issues Directory / Side Panel Review Shielded Layout */}
        <div id="active-issues" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mt-12 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 border-r border-slate-100 pr-4">
            <h2 className="text-xl font-black text-slate-900 pb-4 mb-4 border-b border-slate-100">⚙️ Active Issues Management & Review</h2>
            {complaints.length === 0 ? (
              <p className="text-xs font-bold text-slate-400 text-center py-8">No issues reported in the system yet.</p>
            ) : (
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                {complaints.map((c) => (
                  <div 
                    key={c._id} 
                    onClick={() => setActiveComplaint(c)}
                    className={`p-4 rounded-2xl border flex justify-between items-center cursor-pointer transition-all ${
                      activeComplaint?._id === c._id 
                        ? "border-orange-500 bg-orange-50/30" 
                        : "border-slate-100 bg-slate-50/40 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{c.title || c.issueType}</h4>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase mt-1">Reported on: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <span className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded-full ${
                      c.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                      c.status === "in-progress" || c.status === "assigned" ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-full flex flex-col justify-between min-h-[300px]">
            {activeComplaint ? (
              <div className="space-y-4 w-full">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Selected Issue Details</span>
                  <h3 className="font-black text-base text-slate-900 mt-0.5">{activeComplaint.title || activeComplaint.issueType}</h3>
                </div>
                <p className="text-xs font-semibold text-slate-600 bg-white p-3 rounded-xl border border-slate-100">{activeComplaint.description || activeComplaint.remarks || "No description provided for this report."}</p>
                <div className="flex justify-between items-center text-xs font-bold bg-white p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 uppercase">Current Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                    activeComplaint.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                    activeComplaint.status === "in-progress" || activeComplaint.status === "assigned" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  }`}>{activeComplaint.status}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold bg-white p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 uppercase">Department</span>
                  <span className="text-slate-900">{activeComplaint.department || activeComplaint.dept || "N/A"}</span>
                </div>

                {/* ASSIGNMENT WORKFLOW DROPDOWN INTEGRATION */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                   {activeComplaint.status === "pending" && (
                      <>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">Directly Assign Action To Staff</label>
                           <select 
                              value={selectedAssignee}
                              onChange={(e) => setSelectedAssignee(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                           >
                              {deptUsers.length > 0 ? (
                                 <>
                                    <option value="">-- Select person from {activeComplaint.department } --</option>
                                    {deptUsers.map(u => (
                                       <option key={u._id} value={u._id}>{u.fullName} ({u.role.toUpperCase()})</option>
                                    ))}
                                 </>
                              ) : (
                                 <option value="">-- No staff available in this department --</option>
                              )}
                           </select>
                        </div>
                        <button 
                           onClick={() => {
                              if (!selectedAssignee) {
                                 alert("Kripya complaint assign karne ke liye department se ek staff member select karein!");
                                 return;
                              }
                              handleAssignResolve(activeComplaint._id, "in-progress", selectedAssignee);
                           }}
                           className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                           Assign & Proceed Action
                        </button>
                      </>
                    )}

                    {(activeComplaint.status === "in-progress" || activeComplaint.status === "assigned") && (
                      <button 
                        onClick={() => handleAssignResolve(activeComplaint._id, "resolved")}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        Mark as Resolved
                      </button>
                    )}

                    {activeComplaint.status === "resolved" && (
                      <span className="w-full block text-center py-3 bg-slate-200 text-slate-400 text-xs font-black uppercase rounded-xl">
                        Flow Completed
                      </span>
                    )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                 </svg>
                 <p className="text-xs font-bold text-slate-400 max-w-[200px]">Select an issue card on left to see review and assignment actions.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;