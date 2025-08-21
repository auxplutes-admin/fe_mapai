import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SA_FLAG from "@/assets/SA-FLAG.png";

const handleClick = () => {
  window.location.href = "/dashboard/map";
};

export const Hero = () => (
  <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
    {/* Main Content */}
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
        {/* Left Column: Text */}
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left space-y-6">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
            <span className="block"> Welcome to 
              <br /> The AI-verse of South African mining</span>
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto md:mx-0">
            Explore an intelligent, interactive map of the SA mining landscape powered by real-time insights and conversational AI.
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start">
            <Button
              size="lg"
              onClick={handleClick}
              className="bg-[#002395] hover:bg-[#007749] text-white text-xl md:text-2xl px-12 md:px-16 py-6 md:py-7 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.03] flex items-center gap-3"
            >
              Enter <MoveRight className="w-6 h-6 md:w-7 md:h-7" />
            </Button>
          </div>
        </div>

        {/* Right Column: Flag */}
        <div className="flex items-center justify-center">
          <img
            src={SA_FLAG}
            alt="SA Flag"
            className="w-48 md:w-60 lg:w-72 h-auto object-contain rounded-md shadow-xl"
          />
        </div>
      </div>
    </div>
  </div>
);