'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { assets } from '@/assets/assets'

function useGeolocation() {
  const [coords, setCoords] = useState(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])
  return coords
}

const OrganizationsPage = () => {
  const coords = useGeolocation()
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (coords) {
          params.set('lat', String(coords.lat))
          params.set('lng', String(coords.lng))
        }
        params.set('limit', '10')
        const res = await fetch(`/api/organization/list?${params.toString()}`)
        const data = await res.json()
        if (data.success) setOrganizations(data.organizations)
      } finally {
        setLoading(false)
      }
    }
    fetchOrgs()
  }, [coords])

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-2xl font-semibold mb-4">Nearby organizations</h1>
        <p className="text-sm text-gray-600 mb-6">Find non-profits and shelters accepting menstrual product donations.</p>
        {loading && <p>Loading organizations...</p>}
        <ul className="grid md:grid-cols-2 gap-4">
          {organizations.map((o) => (
            <li key={o._id} className="border rounded-lg p-4 flex items-start gap-3">
              <div className="mt-1">
                {o.verified && (
                  <Image src={assets.checkmark} alt="verified" width={18} height={18} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium">{o.name}</h2>
                  {o.verified && <span className="text-xs text-green-700">Verified</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{o.description}</p>
                <p className="text-sm">{o.addressLine1}{o.addressLine2 ? `, ${o.addressLine2}` : ''}, {o.city}, {o.state} {o.postalCode}</p>
                {o.verified ? (
                  <a href={`/organizations/${o._id}`} className="mt-3 inline-block text-sm text-white bg-gray-800 px-3 py-1.5 rounded">Donate</a>
                ) : (
                  <span className="mt-3 inline-block text-xs text-gray-500">Unverified - in-person donations only</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        {!loading && organizations.length === 0 && (
          <p className="text-sm text-gray-500">No organizations found nearby.</p>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrganizationsPage
