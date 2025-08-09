import React from 'react';
import { Hero } from '@/components/Home/Hero';
import { Navbar } from '@/components/Home/Navbar';
import { Footer } from '@/components/Home/Footer'; // 👈 new import

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#160041] via-[#450275] to-[#F357A8] min-h-screen flex flex-col">
      <Navbar />
        <Hero />
      <Footer />
    </div>
  );
};

export default Home;

