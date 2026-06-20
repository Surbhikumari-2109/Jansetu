import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* 1. HEADER / NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              🏙️ JAN<span className="text-orange-600">SETU</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-orange-600 transition-colors">How it Works</a>
            <a href="#impact" className="hover:text-orange-600 transition-colors">Our Impact</a>
            <a href="#departments" className="hover:text-orange-600 transition-colors">Departments</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="hidden md:block text-slate-600 font-bold hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/login" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all"
            >
              Register Complaint
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <section className="relative pt-20 pb-32 px-6 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            <div className="absolute top-40 -right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-8 border border-orange-200 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              Bihar's Official Smart Civic Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              The People's Bridge to a <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                Better, Cleaner City.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Report potholes, garbage pile-ups, and broken streetlights directly to municipal authorities. Track your resolution in real-time and help build a smarter community.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start a New Report
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm"
              >
                Track Existing Status
              </Link>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS (FEATURES) */}
        <section id="how-it-works" className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Fixing your city is as easy as 1-2-3</h2>
              <p className="text-slate-500 text-lg font-medium">A transparent process from submission to resolution.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line for Desktop */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-4xl mb-6">
                  📸
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. Snap & Report</h3>
                <p className="text-slate-600 font-medium px-4">Take a photo of the civic issue, select the category, and our system auto-detects your location.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-orange-50 rounded-2xl border border-orange-200 shadow-sm flex items-center justify-center text-4xl mb-6">
                  ⚙️
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Smart Assignment</h3>
                <p className="text-slate-600 font-medium px-4">The platform instantly routes your complaint to the correct ward officer and department.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-center text-4xl mb-6">
                  ✅
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Track & Resolve</h3>
                <p className="text-slate-600 font-medium px-4">Get live updates as workers fix the issue. Rate their work once the job is marked complete.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. IMPACT / STATS SECTION */}
        <section id="impact" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-16">Real Results for Real Citizens</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-black text-orange-400 mb-2">12k+</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Issues Resolved</div>
              </div>
              <div>
                <div className="text-5xl font-black text-emerald-400 mb-2">48h</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Avg. Resolution Time</div>
              </div>
              <div>
                <div className="text-5xl font-black text-blue-400 mb-2">38</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Active Wards</div>
              </div>
              <div>
                <div className="text-5xl font-black text-purple-400 mb-2">94%</div>
                <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">Citizen Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
      </main>

    
     {/* 5. FOOTER */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 mb-4 block">
                🏙️ JAN<span className="text-orange-600">SETU</span>
              </span>
              <p className="text-slate-500 font-medium max-w-sm mb-6">
                Bridging the gap between citizens and municipal authorities for a smarter, cleaner, and highly responsive infrastructure.
              </p>
              <div className="text-sm font-bold text-slate-400">
                Helpline: 1800-XXX-XXXX (Toll Free)
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3 text-slate-500 font-medium">
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Submit Complaint</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Track Status</Link></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Supported Departments</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Citizen Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider">Official Login</h4>
              <ul className="space-y-3 text-slate-500 font-medium">
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Municipal Officer Portal</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Field Worker Access</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Super Admin Dashboard</Link></li>
              </ul>
            </div>

          </div>
          
          {/* PERSONALIZED COPYRIGHT & CONTACT LOGS */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-medium gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
              <span>© {new Date().getFullYear()} JANSETU Platform.</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500 text-lg">❤️</span> by <span className="font-bold text-slate-800 tracking-wide">Surbhi Kumari</span>
              </span>
            </div>

            {/* Social & Contact Icons */}
            <div className="flex items-center gap-5">
              
              {/* GitHub Link */}
              <a href="https://github.com/your-github-username" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>

              {/* LinkedIn Link */}
              <a href="https://linkedin.com/in/your-linkedin-id" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>

              {/* Email Link */}
              <a href="mailto:your.email@example.com" className="text-slate-400 hover:text-orange-600 transition-colors" aria-label="Email">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;