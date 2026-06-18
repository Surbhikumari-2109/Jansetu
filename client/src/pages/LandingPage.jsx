import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustSection from "../components/TrustSection";

const LandingPage = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <TrustSection />
    </div>
  );
};

export default LandingPage;