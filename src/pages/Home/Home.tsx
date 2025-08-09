import React from 'react';
import { Hero } from '@/components/Home/Hero';
import { Navbar } from '@/components/Home/Navbar';
import { Footer } from '@/components/Home/Footer'; // 👈 new import

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#160041] via-[#450275] to-[#F357A8] min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

