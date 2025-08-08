import { Hero } from '@/components/Home/Hero'
import { Navbar } from '@/components/Home/Navbar' 
import CTA from '@/components/Home/CTA'
import React from 'react'

const Home:React.FC = () => {
  return (
    <>
      <div  className=' bg-gradient-to-br from-[#160041] via-[#450275] to-[#F357A8]'>
      <Navbar/>
      <Hero/>
      <CTA/>
      </div>
    </>

  )
}

export default Home