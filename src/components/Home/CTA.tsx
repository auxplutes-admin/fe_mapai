import React from 'react';
import KONGO_MAP from "@/assets/kongo-map.png";

const CTA: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center min-h-[500px] py-12">
      <div className="bg-[#2B0A4B] rounded-2xl shadow-xl flex flex-col md:flex-row max-w-7xl w-full p-8 md:p-12 gap-8 md:gap-12">
        {/* Left: Map */}
        <div className="flex-1 flex justify-center items-center mb-8 md:mb-0 md:mr-8">
          {/* SVG Map of DRC with Kongo Central highlighted */}
          <img src={KONGO_MAP} alt="Kongo Map" className="w-full h-full" />
        </div>
        {/* Right: Text */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Kongo Central</h2>
            <p className="text-white/80 text-sm mb-2">
              <span className="font-semibold">(Kongo Kongo dia Kati)</span>, formerly Bas-Congo, is one of the 26 provinces of the Democratic Republic of the Congo.
            </p>
            <p className="text-white/70 text-sm mb-2">
              Kongo Central is the only province in the country with an ocean coastline, with a narrow frontage on the Atlantic Ocean to the west. It borders the city province of Kinshasa to the north-east, the province of Kwango to the east, and the Republic of Angola to the south and north.
            </p>
            <p className="text-white/70 text-sm mb-2">
              The provincial capital is Matadi, a major port city on the Congo River, while Boma, the former capital, is another important urban center. Kongo Central covers an area of about 53,920 km² and has a population of over 5 million people, predominantly from the Bakongo ethnic group.
            </p>
            <p className="text-white/70 text-sm mb-2">
              The province is rich in natural resources, including oil, limestone, and agricultural products such as cassava, bananas, and palm oil. Its strategic location makes it a vital gateway for trade, with the Matadi Bridge and the seaport facilitating much of the DRC's imports and exports.
            </p>
            <p className="text-white/70 text-sm">
              Kongo Central is also known for its cultural heritage, vibrant music, and historical sites, including the Cataracts of the Congo River and remnants of colonial architecture. The province plays a crucial role in the economic and cultural landscape of the DRC.
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="bg-[#6C3DF4] hover:bg-[#4B1E9B] text-white font-semibold px-8 py-3 rounded-full shadow-md transition"
            >
              Ask me more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;