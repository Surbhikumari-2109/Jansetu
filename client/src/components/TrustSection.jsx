const TrustSection = () => {
  const categories = [
    "Road Damage",
    "Drainage",
    "Street Lights",
    "Garbage",
    "Water Leakage",
    "Pollution",
  ];

  return (
    <section className="pb-32">

      <div className="max-w-7xl mx-auto px-6">

        <p className="text-center text-zinc-500 mb-12">
          Civic Categories
        </p>

        <div className="flex flex-wrap justify-center gap-4">

          {categories.map((item) => (
            <div
              key={item}
              className="
                px-6
                py-3
                rounded-full
                border
                border-white/10
                bg-white/5
                text-zinc-300
              "
            >
              {item}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default TrustSection;