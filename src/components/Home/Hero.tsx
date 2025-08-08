import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import KONGO_FLAG from "@/assets/kongo-flag.png";
import GLOBE_LOGO from "@/assets/globe-logo.png";

const handleClick = () => {
  window.location.href = "/dashboard/map";
}

export const Hero = () => (
  <div className="w-full min-h-screen flex items-center justify-center bg-opacity-90">
    <div className="container mx-auto max-w-7xl px-6">
      <div className="flex flex-col items-center justify-center space-y-20">
        <div className="flex flex-col items-center space-y-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <img 
                src={GLOBE_LOGO} 
                alt="Globe Logo" 
                className="w-40 h-40 md:w-48 md:h-48 object-contain"
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <img 
                src={KONGO_FLAG} 
                alt="DRC Flag" 
                className="w-40 h-28 md:w-48 md:h-32 object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight">
            Welcome to the AI
            <span className="block mt-2">Verse of DRC Mining</span>
          </h1>
        </div>
        <Button 
          size="lg" 
          onClick={handleClick}
          className="bg-[#3B1687] hover:bg-[#2D0A4E] text-white text-xl md:text-2xl px-16 md:px-24 py-6 md:py-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
        >
          Enter <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
      </div>
    </div>
  </div>
);