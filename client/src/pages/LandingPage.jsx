import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle,
  PhoneCall,
  Globe,      
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
    satisfaction: '0%'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${baseURL}/api/stats/system-metrics`);
        if (res.data.success) {
          setMetrics(res.data.stats);
        }
      } catch (err) {
        console.error("Could not load system metrics dynamically", err);
        // Fallback production-ready counts
        setMetrics({
          total: 0,
          resolved: 0,
          inProgress: 0,
          satisfaction: '0%'
        });
      }
    };
    fetchMetrics();
  }, []);

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* 1. HEADER / NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <Building2 className="h-7 w-7 text-orange-600" />
            <span className="text-2xl font-black tracking-tight text-slate-900">
              JAN<span className="text-orange-600">SETU</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wider text-slate-600">
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, '#how-it-works')} className="hover:text-orange-600 transition-colors cursor-pointer">How it Works</a>
            <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="hover:text-orange-600 transition-colors cursor-pointer">Features</a>
            <a href="#impact" onClick={(e) => handleSmoothScroll(e, '#impact')} className="hover:text-orange-600 transition-colors cursor-pointer">Our Impact</a>
            <a href="#footer-content" onClick={(e) => handleSmoothScroll(e, '#footer-content')} className="hover:text-orange-600 transition-colors cursor-pointer">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-slate-600 font-bold hover:text-slate-900 transition-colors text-sm uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link 
              to="/login" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              Register Complaint
            </Link>
          </div>

          {/* Mobile Menu Trigger & Visible Sign In */}
          <div className="flex items-center gap-3 md:hidden">
            <Link 
              to="/login" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              Sign In
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/60 bg-white px-6 py-6 flex flex-col gap-4 shadow-xl">
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, '#how-it-works')} className="font-bold text-sm uppercase tracking-wider text-slate-600 py-2 border-b border-slate-50">How it Works</a>
            <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="font-bold text-sm uppercase tracking-wider text-slate-600 py-2 border-b border-slate-50">Features</a>
            <a href="#impact" onClick={(e) => handleSmoothScroll(e, '#impact')} className="font-bold text-sm uppercase tracking-wider text-slate-600 py-2 border-b border-slate-50">Our Impact</a>
            <a href="#footer-content" onClick={(e) => handleSmoothScroll(e, '#footer-content')} className="font-bold text-sm uppercase tracking-wider text-slate-600 py-2 border-b border-slate-50">Contact</a>
            
            <div className="flex flex-col gap-3 mt-2">
               <Link to="/login" className="text-center w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-sm">Register Complaint</Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/10 to-slate-50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute top-40 -right-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-100/80 text-orange-800 font-black text-xs uppercase tracking-wider mb-8 border border-orange-200/80 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              Bihar's Official Smart Civic Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              The People's Bridge to a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Better & Cleaner City
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Report potholes, garbage pile-ups, and broken streetlights directly to municipal authorities. Track your resolution in real-time and help build a smarter community.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start a New Report <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-base transition-all shadow-sm cursor-pointer"
              >
                Track Existing Status
              </Link>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Fixing your city is as easy as 1-2-3</h2>
              <p className="text-slate-500 text-lg font-bold tracking-wide uppercase text-sm">A transparent process from submission to resolution.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 z-0"></div>

              <div className="relative z-10 flex flex-col items-center text-center mb-8 md:mb-0">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                  <Wrench className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Snap & Report</h3>
                <p className="text-slate-600 font-medium px-4">Take a photo of the civic issue, select the category, and our system auto-detects your location.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center mb-8 md:mb-0">
                <div className="w-24 h-24 bg-orange-50 rounded-2xl border border-orange-200 shadow-sm flex items-center justify-center mb-6">
                  <ShieldCheck className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Smart Assignment</h3>
                <p className="text-slate-600 font-medium px-4">The platform instantly routes your complaint to the correct ward officer and department.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Track & Resolve</h3>
                <p className="text-slate-600 font-medium px-4">Get live updates as workers fix the issue. Rate their work once the job is marked complete.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PLATFORM FEATURES */}
        <section id="features" className="py-24 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Core Platform Features</h2>
                <p className="text-slate-500 font-bold tracking-wide uppercase text-sm">Empowering civic reporting with modern digital tools.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                   <h3 className="font-black text-slate-900 text-lg mb-2">Real-time Tracker</h3>
                   <p className="text-slate-600 font-medium text-sm leading-relaxed">Dedicated citizen dashboards to monitor status flow from pending to in-progress and successful resolution.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                   <h3 className="font-black text-slate-900 text-lg mb-2">Departmental Routing</h3>
                   <p className="text-slate-600 font-medium text-sm leading-relaxed">Automated ingestion of issues directing tickets to authorized civic divisions like the water supply board or sanitation infrastructure.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                   <h3 className="font-black text-slate-900 text-lg mb-2">Role-based Access</h3>
                   <p className="text-slate-600 font-medium text-sm leading-relaxed">Segregated modules for citizens, ground field-workers, municipal ward officers, and overall system admins.</p>
                </div>
             </div>
          </div>
        </section>

        {/* 5. DYNAMIC DATA STATS SECTION */}
        <section id="impact" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-16 tracking-tight">Real Results for Real Citizens</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-black text-orange-400 mb-2">{metrics.total}</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs">Issues Submitted</div>
              </div>
              <div>
                <div className="text-5xl font-black text-emerald-400 mb-2">{metrics.resolved}</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs">Issues Resolved</div>
              </div>
              <div>
                <div className="text-5xl font-black text-blue-400 mb-2">{metrics.inProgress}</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs">In Progress</div>
              </div>
              <div>
                <div className="text-5xl font-black text-purple-400 mb-2">{metrics.satisfaction}</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-xs">Resolution Rate</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer id="footer-content" className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 mb-4 block flex items-center gap-2">
                <Building2 className="h-7 w-7 text-orange-600" /> JAN<span className="text-orange-600">SETU</span>
              </span>
              <p className="text-slate-500 font-medium max-w-sm mb-6 leading-relaxed">
                Bridging the gap between citizens and municipal authorities for a smarter, cleaner, and highly responsive infrastructure.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-3 text-slate-500 font-bold text-sm">
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Submit Complaint</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Track Status</Link></li>
                <li><a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="hover:text-orange-600 transition-colors cursor-pointer">Core Features</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Citizen Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Official Login</h4>
              <ul className="space-y-3 text-slate-500 font-bold text-sm">
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Municipal Officer Portal</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Field Worker Access</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Super Admin Dashboard</Link></li>
              </ul>
            </div>
          </div>
          
          {/* PERSONALIZED COPYRIGHT & SOCIAL MEDIA ICONS */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-bold gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left tracking-wide">
              <span>© {new Date().getFullYear()} JANSETU Platform.</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500 text-lg">❤️</span> by <span className="font-black text-slate-800 tracking-wide">Surbhi Kumari</span>
              </span>
            </div>

            {/* Social Icons mapped via FontAwesome */}
            <div className="flex items-center gap-5">
              <a href="https://github.com/Surbhikumari-2109" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer" >
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/surbhi-kumari-194046316/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer" >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="mailto:surbhipriya2109@gmail.com" className="text-slate-400 hover:text-orange-600 transition-colors cursor-pointer" >
                <FaEnvelope className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;