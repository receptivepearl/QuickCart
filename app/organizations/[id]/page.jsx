'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'
import { useParams } from 'next/navigation'

const OrganizationDetailPage = () => {
  const params = useParams()
  const { id } = params
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await axios.get(`/api/organizations/${id}`)
        if (data.success) setOrg(data.organization)
        else setError(data.message || 'Failed to load')
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) run()
  }, [id])

  return (
    <>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-32 py-8 max-w-3xl'>
        {loading && <p>Loading…</p>}
        {error && !loading && <p className='text-red-600'>{error}</p>}
        {org && (
          <div>
            <h1 className='text-2xl font-medium'>{org.name}</h1>
            <p className='text-gray-600 mt-1'>{org.address}</p>
            <p className='mt-4'>{org.description}</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrganizationDetailPage
