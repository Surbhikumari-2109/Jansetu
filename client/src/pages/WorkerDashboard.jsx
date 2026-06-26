import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  ListOrdered, 
  UserCircle,
  Zap,
  MousePointer
} from 'lucide-react';

const WorkerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [workStatus, setWorkStatus] = useState('assigned');
  const [workerName, setWorkerName] = useState('Worker');
  const [workerDept, setWorkerDept] = useState('Municipal Staff');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch tasks assigned specifically to this worker
  const fetchAssignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      // Adjust endpoint to match your backend worker route (e.g., /api/complaints/worker-tasks)
      const res = await axios.get('${import.meta.env.VITE_API_BASE_URL}/api/complaints/worker-tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data.complaints || []);
    } catch (error) {
      console.error('Failed to fetch worker tasks', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setWorkerName(userObj.fullName || userObj.name || 'Worker');
        setWorkerDept(userObj.department || 'Field Operations');
      } catch (e) {
        console.error(e);
      }
    }
    fetchAssignedTasks();
  }, []);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setWorkStatus(task.status || 'assigned');
    setStatusNote(task.progressNote || '');
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/${selectedTask._id || selectedTask._id}/worker-progress`,
        { status: workStatus, progressNote: statusNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Task progress updated successfully!');
      fetchAssignedTasks();
      setSelectedTask(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update task.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-700 border-red-100 font-black';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-100 font-black';
      default: return 'bg-blue-50 text-blue-700 border-blue-100 font-black';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      {/* TOP NAVIGATION (Stays perfectly locked at the top using fixed positioning, preventing out-of-view scroll issues) */}
      <nav className="bg-slate-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-2.5">
          
          {/* Logo */}
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4 sm:pr-8 py-0.5">
            <Building2 className="h-5 w-5 sm:h-6 w-6 text-orange-500" />
            <span className="text-lg sm:text-xl font-black tracking-tight">JAN<span className="text-orange-500">SETU</span></span>
          </div>

          {/* Worker Portal Badge - Anchored directly onto main navbar permanently outside menu for all screen widths */}
          <div className="flex items-center pl-2 sm:pl-4 pr-1 sm:pr-2">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-400 bg-blue-950/30 rounded-lg border border-blue-800/30 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <UserCircle className="h-4 w-4 sm:h-5 w-5" />
              Worker Portal
            </span>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden sm:flex items-center space-x-1 px-4 border-l border-slate-800">
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-slate-300 hover:text-white focus:outline-none p-1.5 rounded-lg border border-slate-700"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE MENU DROPDOWN (Strictly opens directly underneath header row, independent of scrolling pane) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col bg-slate-900 border-b border-slate-800 shadow-xl z-[100] px-6 py-4 space-y-3 text-white w-full fixed top-[50px] left-0 right-0 border-t border-slate-800/40">
          
          <div className="w-full pt-1 pb-1 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-800/50 text-left flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>Quick Access</span>
          </div>

          <a 
            href="#assigned-tasks-section" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-left border-b border-slate-800/40 flex items-center gap-3 rounded"
          >
            <ListOrdered className="h-4 w-4" /> My Assigned Tasks
          </a>

          <button 
            onClick={handleLogout} 
            className="w-full py-3 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-start gap-3 rounded border-t border-slate-800/60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 pt-24">
        {/* WORKER DETAILS HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Worker Dashboard</h1>
            <p className="text-slate-500 font-bold text-sm mt-1">
              {workerName} — <span className="text-orange-600">{workerDept}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center min-w-[110px]">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Tasks</span>
              <span className="block text-2xl font-black text-slate-900 mt-0.5">{tasks.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center min-w-[110px]">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
              <span className="block text-2xl font-black text-slate-900 mt-0.5">
                {tasks.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
          </div>
        </div>

        <div id="assigned-tasks-section" className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ASSIGNED TASKS LIST */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-black text-slate-900">My Assigned Tasks</h2>
            {tasks.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No issues assigned to your unit currently.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task._id} 
                  className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all border-l-4 ${
                    task.status === 'in-progress' ? 'border-l-orange-500' : 'border-l-blue-500'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs border rounded-lg uppercase tracking-wider ${getPriorityColor(task.priority || 'Medium')}`}>
                        {task.priority || 'Medium'} Priority
                      </span>
                      <span className="text-xs font-black text-slate-400 tracking-wider bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                        {task.complaintId || task._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1 leading-snug">{task.title}</h3>
                    <p className="text-xs font-black text-orange-600 uppercase tracking-wider mb-3">{task.category}</p>
                    <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                      📍 {task.address}, {task.ward}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleSelectTask(task)}
                    className="w-full md:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
                  >
                    {task.status === 'in-progress' ? 'Update Progress' : 'Start Task'}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* UPDATE WORK PROGRESS SIDE PANEL */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-28">
            {selectedTask ? (
              <form onSubmit={handleUpdateProgress} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug mb-1">Update Work Progress</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{selectedTask.complaintId}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-600">
                  ⚠️ Issue: <span className="text-slate-900">{selectedTask.title}</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Select Status</label>
                  <select 
                    value={workStatus} 
                    onChange={(e) => setWorkStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold outline-none bg-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  >
                    <option value="assigned">Assigned / En Route</option>
                    <option value="in-progress">Working — Actively Resolving</option>
                    <option value="resolved">Resolved — Task Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Progress Note / Remarks</label>
                  <textarea 
                    rows={4}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add breakdown actions, progress percentage, or notes for officials..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-y"
                    required
                  />
                </div>

                {/* Optional: Add evidence photo file input here if your worker layout uses resolution photos */}

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all ${isLoading ? 'opacity-70' : ''}`}
                  >
                    {isLoading ? 'Saving...' : 'Submit Update'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block text-slate-400 flex justify-center"><MousePointer className="h-10 w-10 text-slate-400 animate-pulse" /></span>
                <p className="text-slate-500 font-bold text-sm">Select a task from your list to update its operational status.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;