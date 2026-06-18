import { MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 text-white">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-indigo-100">
          <MapPin size={18} />
          Bihar Civic Intelligence Platform
        </div>

        <h1 className="mt-4 text-4xl font-bold leading-tight">
          Building a Better Bihar,
          One Issue At A Time.
        </h1>

        <p className="mt-4 text-indigo-100">
          Report civic problems, track progress,
          and help create transparent public services.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;