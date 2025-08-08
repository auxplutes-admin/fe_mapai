import React from 'react';
import { Hero } from '@/components/Home/Hero';
import { Navbar } from '@/components/Home/Navbar';
import CTA from '@/components/Home/CTA';
import { Footer } from '@/components/Home/Footer'; // 👈 new import

const Home: React.FC = () => {
  return (
    <>
      <div className="scroll-smooth bg-gradient-to-br from-[#160041] via-[#450275] to-[#F357A8] min-h-screen flex flex-col">
        <Navbar />

        <Hero />

        <section id="next-section" className="relative">
          <CTA />
        </section>

        <div className="h-24" />

        {/* Footer stays at bottom */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
