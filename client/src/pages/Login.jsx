import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [portalType, setPortalType] = useState('public'); // 'public' or 'official'
  const [role, setRole] = useState('citizen'); // 'citizen' or 'worker'
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (portalType === 'official') {
        // OFFICIAL STAFF LOGIN API
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password
        });
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const userRole = res.data.user.role; 
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/officer');
        }
      } 
      else {
        // PUBLIC PORTAL
        if (isLogin) {
          // CITIZEN LOGIN
          const res = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
          });
          
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/citizen-dashboard');
        } 
        else {
          // CITIZEN / WORKER REGISTRATION
          await axios.post('http://localhost:5000/api/auth/register', {
            fullName,
            email,
            password,
            role: role
          });

          alert("Registration successful! Please sign in.");
          setIsLogin(true); 
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl font-black tracking-tight text-slate-900 cursor-pointer inline-block mb-2">
          🏙️ JAN<span className="text-orange-600">SETU</span>
        </Link>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          {portalType === 'official' 
            ? 'Official Staff Portal' 
            : isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        
        {portalType === 'public' && (
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Or{' '}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-orange-600 hover:text-orange-500 transition-colors"
            >
              {isLogin ? 'register as a new citizen' : 'sign in to your existing account'}
            </button>
          </p>
        )}
        {portalType === 'official' && (
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Restricted access for Municipal Officers & Admins.
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          {portalType === 'public' && !isLogin && (
            <div className="mb-6 flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'citizen' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'worker' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Field Worker
              </button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {portalType === 'public' && !isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium" 
                  placeholder="Rahul Kumar" 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {portalType === 'official' ? 'Official Email / Staff ID' : 'Email address'}
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium" 
                placeholder={portalType === 'official' ? 'officer@jansetu.gov.in' : 'you@example.com'} 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium" 
                placeholder="••••••••" 
              />
            </div>

            {(isLogin || portalType === 'official') && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-900">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-bold text-orange-600 hover:text-orange-500">Forgot password?</a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 focus:outline-none transition-all ${
                isLoading ? 'bg-slate-500 cursor-not-allowed' : 'hover:bg-slate-800 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'
              }`}
            >
              {isLoading ? 'Processing...' : portalType === 'official' ? 'Secure Staff Login' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => {
              setPortalType(portalType === 'public' ? 'official' : 'public');
              setIsLogin(true); 
            }}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            {portalType === 'public' ? '🔒 Switch to Official Staff Login' : '← Back to Public Portal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;