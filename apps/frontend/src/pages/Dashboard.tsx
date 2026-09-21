
import { HeroSection } from "../components/sections/HeroSection";
import SubBanner from "../components/sections/SubBanner";
import Footer from "../components/layout/Footer";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white">

      <main>
        <HeroSection />
        <SubBanner />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;