'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-32 py-10 max-w-3xl'>
        <h1 className='text-3xl font-semibold mb-4'>About Go With The Flow</h1>
        <p className='mb-4'>
          Go With The Flow connects donors with nearby nonprofits and women’s shelters
          to provide menstrual products where they’re needed most. You can find
          organizations near you and donate products directly. Verified organizations
          are registered with us and can accept direct orders via the app.
        </p>
        <p className='mb-4'>
          Organizations can register to get verified and receive donations. Our
          dashboard shows total orders and products donated. Administrators review
          organizations and track impact across the platform.
        </p>
        <p>
          Our mission is to remove barriers to period care by making it easy for
          anyone to help. Thank you for supporting menstrual equity.
        </p>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
