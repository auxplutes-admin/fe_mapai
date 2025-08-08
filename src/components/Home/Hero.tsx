import { MoveRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import KONGO_FLAG from "@/assets/kongo-flag.png";
import GLOBE_LOGO from "@/assets/globe-logo.png";

const handleClick = () => {
  window.location.href = "/dashboard/map";
}

export const Hero = () => (
  <div className="w-full min-h-screen flex items-center justify-center">
    <div className="container mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16 items-center text-white">
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm backdrop-blur">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Gen AI powered
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Welcome to the AI
            <span className="block mt-2">Verse of DRC Mining</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto md:mx-0">
            Explore an intelligent, interactive map of the DRC mining landscape powered by real-time insights and conversational AI.
          </p>
          <div className="pt-2 flex items-center justify-center md:justify-start">
            <Button
              size="lg"
              onClick={handleClick}
              className="bg-[#3B1687] hover:bg-[#2D0A4E] text-white text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] flex items-center gap-3"
            >
              Enter <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-10">
          <img
            src={GLOBE_LOGO}
            alt="Globe Logo"
            className="w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain drop-shadow-xl"
          />
          <img
            src={KONGO_FLAG}
            alt="DRC Flag"
            className="w-40 h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 object-contain rounded-md shadow-xl"
          />
        </div>
      </div>
    </div>
  </div>
);