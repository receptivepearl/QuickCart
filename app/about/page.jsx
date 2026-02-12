'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Go With The Flow</h1>
        <p className="text-sm text-gray-700 mb-4">Our mission is to eliminate period poverty by connecting donors with local nonprofits and shelters that support menstruating individuals. We make it simple to find nearby verified organizations and donate menstrual products either in person or by placing a direct donation order.</p>
        <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
          <li>Discover nearby organizations accepting menstrual product donations</li>
          <li>Verified organizations can receive direct donation orders</li>
          <li>Organizations get a dashboard to track orders and products received</li>
          <li>Admins verify organizations and monitor platform-wide impact</li>
        </ul>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
