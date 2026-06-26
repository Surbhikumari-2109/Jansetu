import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // URL query se role nikalna (e.g., /user-directory?role=citizen)
  const queryParams = new URLSearchParams(location.search);
  const roleType = queryParams.get('role');

  // Role ke hisab se title decide karna
  const getTitle = () => {
    if (roleType === 'citizen') return 'Registered Citizens Directory';
    if (roleType === 'officer') return 'Municipal Officers Directory';
    if (roleType === 'worker') return 'Field Ground-Staff Directory';
    return ' System Staff Directory';
  };

  const fetchUsersByRole = async () => {
    if (!roleType) {
      navigate('/admin-dashboard');
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users-by-role?role=${roleType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch user directory', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersByRole();
  }, [roleType]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight"> JAN<span className="text-orange-500">SETU</span></span>
          </div>
          <Link to="/admin-dashboard" className="text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer">
            &larr; Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4 mb-6">{getTitle()}</h2>
          
          {isLoading ? (
            <p className="text-sm font-bold text-slate-400 text-center py-12">Loading user directory...</p>
          ) : users.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 text-center py-12">No records found for this category.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-wider border-y border-slate-100">
                    <th className="py-4 px-4">Full Name</th>
                    <th className="py-4 px-4">Email Address</th>
                    <th className="py-4 px-4">Contact Number</th>
                    {users[0]?.department && <th className="py-4 px-4">Department</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  {users.map((u) => (
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
      </main>
    </div>
  );
};

export default UserDirectory;