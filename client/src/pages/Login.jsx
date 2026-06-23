import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, 
  LockKeyhole,
  AlertCircle,
  Eye,
  EyeOff 
} from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [portalType, setPortalType] = useState('public'); // 'public' or 'official'
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States for inline input errors & password toggling
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inline empty inputs before making network calls
    const errors = {};
    if (!isLogin && portalType === 'public' && !fullName.trim()) {
      errors.fullName = 'Full name is required for registration.';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

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
          // CITIZEN REGISTRATION (Role hardcoded to citizen since worker is registered via admin)
          await axios.post('http://localhost:5000/api/auth/register', {
            fullName,
            email,
            password,
            role: 'citizen'
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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="text-3xl font-black tracking-tight text-slate-900 cursor-pointer inline-block mb-1">
          <span className="flex items-center gap-1 justify-center">
            <Building2 className="h-8 w-8 text-slate-900" /> 
            JAN<span className="text-orange-600">SETU</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mt-2">
          {portalType === 'official' 
            ? 'Official Staff Portal' 
            : isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        
        {portalType === 'public' && (
          <p className="mt-2 text-sm text-slate-600 font-medium">
            Or{' '}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormErrors({});
              }} 
              className="font-bold text-orange-600 hover:text-orange-500 transition-colors cursor-pointer"
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

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/60 sm:rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {portalType === 'public' && !isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                  }} 
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50" 
                  placeholder="Rahul Kumar" 
                />
                {formErrors.fullName && <p className="text-red-600 font-extrabold text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{formErrors.fullName}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {portalType === 'official' ? 'Official Email / Staff ID' : 'Email address'}
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                }} 
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50" 
                placeholder={portalType === 'official' ? 'officer@jansetu.gov.in' : 'xyz123@gmail.com '} 
              />
              {formErrors.email && <p className="text-red-600 font-extrabold text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                  }} 
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 font-medium outline-none bg-slate-50/50 pr-12" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-600 font-extrabold text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{formErrors.password}</p>}
            </div>

            {(isLogin || portalType === 'official') && (
              <div className="flex items-center justify-between pt-1">
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
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-900 focus:outline-none transition-all cursor-pointer mt-2 ${
                isLoading ? 'bg-slate-500 cursor-not-allowed' : 'hover:bg-slate-800 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'
              }`}
            >
              {isLoading ? 'Processing...' : portalType === 'official' ? 'Secure Staff Login' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* SWITCH PORTAL BUTTON CENTERED DIRECTLY UNDER SUBMIT */}
            <div className="pt-2 flex justify-center">
              <button 
                type="button"
                onClick={() => {
                  setPortalType(portalType === 'public' ? 'official' : 'public');
                  setIsLogin(true); 
                  setFormErrors({});
                }}
                className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60"
              >
                {portalType === 'public' ? <><LockKeyhole className="h-4 w-4 text-orange-600" /> Switch to Official Staff Login</> : '← Back to Public Portal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;