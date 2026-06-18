const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <div>
          <h1 className="text-white text-2xl font-bold">
            JanSetu Bihar
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#">Features</a>
          <a href="#">How It Works</a>
          <a href="#">Departments</a>
          <a href="#">Analytics</a>
        </nav>

        <div className="flex gap-3">
          <button className="text-white px-4 py-2">
            Login
          </button>

          <button className="bg-white text-black px-5 py-2 rounded-full font-medium">
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;