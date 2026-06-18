const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      <div className="absolute inset-0">

        <div className="absolute top-32 left-20 w-96 h-96 bg-indigo-500/20 blur-[150px]" />

        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 blur-[150px]" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="max-w-5xl">

          <p className="text-indigo-400 mb-6 tracking-widest uppercase">
            Bihar Civic Intelligence Platform
          </p>

          <h1 className="text-white text-6xl md:text-8xl font-bold leading-none">
            Report.
            <br />
            Track.
            <br />
            Improve.
          </h1>

          <p className="mt-8 text-xl text-zinc-400 max-w-2xl">
            Transforming how citizens and municipalities
            collaborate to solve infrastructure issues across Bihar.
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">

            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold">
              Report an Issue
            </button>

            <button className="border border-white/20 text-white px-8 py-4 rounded-full">
              Explore Complaints
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;