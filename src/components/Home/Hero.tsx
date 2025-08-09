import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import KONGO_FLAG from "@/assets/kongo-flag.png";
import GLOBE_LOGO from "@/assets/globe-logo.png";

const handleClick = () => {
  window.location.href = "/dashboard/map";
};

export const Hero = () => (
  <div className="relative w-full flex items-center justify-center min-h-screen">
    {/* Top-left globe + label */}
    <div className="absolute top-6 left-6 z-20 flex flex-col items-start gap-2">
      <img
        src={GLOBE_LOGO}
        alt="Globe Logo"
        className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl"
      />
      <span className="text-white/90 text-sm md:text-base font-medium tracking-wide">
        Geoanalysis.ai
      </span>
    </div>

    {/* Main Content */}
    <div className="container mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16 items-center text-white min-h-full">
        {/* Left Column: Text */}
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="block">Welcome,</span>
            <span className="block">To the AI-verse of DRC mining</span>
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto md:mx-0">
            Explore an intelligent, interactive map of the DRC mining landscape powered by real-time insights and conversational AI.
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start">
            <Button
              size="lg"
              onClick={handleClick}
              className="bg-[#3B1687] hover:bg-[#2D0A4E] text-white text-xl md:text-2xl px-12 md:px-16 py-6 md:py-7 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.03] flex items-center gap-3"
            >
              Enter <MoveRight className="w-6 h-6 md:w-7 md:h-7" />
            </Button>
          </div>
        </div>

        {/* Right Column: Flag */}
        <div className="flex items-center justify-center">
          <img
            src={KONGO_FLAG}
            alt="DRC Flag"
            className="w-48 md:w-60 lg:w-72 h-auto object-contain rounded-md shadow-xl"
          />
        </div>
      </div>
    </div>
  </div>
);
