import React from 'react';
import { Hero } from '@/components/Home/Hero';
import { Navbar } from '@/components/Home/Navbar';
import { Footer } from '@/components/Home/Footer'; // 👈 new import

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#002395] via-[#007749] to-[#DE3831] min-h-screen flex flex-col">
      <Navbar />
        <Hero />
      <Footer />
    </div>
  );
};

export default Home;

