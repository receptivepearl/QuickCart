'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'

const OrgDashboardPage = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const mine = await axios.get('/api/organizations/mine')
        if (!mine.data.success) throw new Error(mine.data.message || 'No organization found')
        const orgId = mine.data.organization._id
        const { data } = await axios.get(`/api/donations?organizationId=${orgId}`)
        if (data.success) setDonations(data.donations)
        else setError(data.message || 'Failed to load donations')
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const totalOrders = donations.length
  const totalProducts = useMemo(() => donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0), [donations])

  return (
    <>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-32 py-8'>
        <h1 className='text-2xl font-medium mb-6'>Organization Dashboard</h1>
        {loading && <p>Loading…</p>}
        {error && !loading && <p className='text-red-600'>{error}</p>}
        {!loading && !error && (
          <div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
              <div className='border rounded p-4'><div className='text-sm text-gray-500'>Total Orders</div><div className='text-2xl font-semibold'>{totalOrders}</div></div>
              <div className='border rounded p-4'><div className='text-sm text-gray-500'>Total Products Donated</div><div className='text-2xl font-semibold'>{totalProducts}</div></div>
            </div>
            <div className='border rounded'>
              <div className='p-4 border-b font-medium'>Recent donations</div>
              <ul className='divide-y'>
                {donations.map((d) => (
                  <li key={d._id} className='p-4 text-sm'>
                    <div className='font-medium'>Quantity: {d.quantity}</div>
                    <div className='text-gray-600'>Description: {d.description || '—'}</div>
                    <div className='text-gray-500 text-xs'>Date: {new Date(d.date).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrgDashboardPage
