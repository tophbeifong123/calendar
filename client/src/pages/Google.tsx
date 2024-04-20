import React from 'react';
import { CustomNavbar } from '@/components/Navbar';
import SlideBar from "@/components/SlideBar";

function Google() {
  return (
    <>
      <CustomNavbar />
      <div className="flex h-screen bg-blue-50">
      <SlideBar/>
        google
      </div>
    </>
  )
}

export default Google