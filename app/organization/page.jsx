'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const OrganizationSelfPage = () => {
  const [org, setOrg] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'USA', lat: '', lng: ''
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/organization/my')
      const data = await res.json()
      if (data.success) setOrg(data.organization)
    }
    load()
  }, [])

  const registerOrg = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/organization/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lat: Number(form.lat), lng: Number(form.lng) })
      })
      const data = await res.json()
      if (data.success) {
        setOrg(data.organization)
        alert('Organization submitted for verification')
      } else {
        alert(data.message || 'Error')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadStats = async () => {
      if (!org?._id) return
      const sp = new URLSearchParams({ organizationId: org._id })
      const res = await fetch(`/api/donation/list?${sp.toString()}`)
      const data = await res.json()
      if (data.success) {
        setStats({ totalOrders: data.totalOrders, totalProducts: data.totalProducts })
        setOrders(data.donations || [])
      }
    }
    loadStats()
  }, [org?._id])

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        {!org ? (
          <div className="max-w-xl">
            <h1 className="text-2xl font-semibold mb-4">Register your organization</h1>
            <form onSubmit={registerOrg} className="grid gap-3">
              {[
                ['name','Organization name'],
                ['description','Description'],
                ['addressLine1','Address line 1'],
                ['addressLine2','Address line 2'],
                ['city','City'],
                ['state','State'],
                ['postalCode','Postal code'],
                ['country','Country'],
                ['lat','Latitude'],
                ['lng','Longitude']
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm mb-1">{label}</label>
                  {key === 'description' ? (
                    <textarea className="w-full border rounded px-3 py-2" rows={3} value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})} />
                  ) : (
                    <input className="w-full border rounded px-3 py-2" value={form[key]} onChange={(e)=>setForm({...form,[key]:e.target.value})} />
                  )}
                </div>
              ))}
              <button disabled={loading} className="bg-gray-800 text-white rounded px-4 py-2 disabled:opacity-60">{loading ? 'Submitting...' : 'Submit'}</button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-2">{org.name}</h1>
            <p className="text-sm text-gray-600 mb-2">{org.description}</p>
            <p className="text-sm mb-2">Status: {org.verified ? 'Verified' : 'Pending approval'}</p>
            {stats && (
              <div className="mt-4">
                <h2 className="text-lg font-medium mb-2">Donation dashboard</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded p-4"><p className="text-sm">Total orders</p><p className="text-2xl font-semibold">{stats.totalOrders}</p></div>
                  <div className="border rounded p-4"><p className="text-sm">Products donated</p><p className="text-2xl font-semibold">{stats.totalProducts}</p></div>
                </div>
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Recent orders</h3>
                  <ul className="grid gap-2">
                    {orders.map(o => (
                      <li key={o._id} className="border rounded p-3 text-sm flex items-center justify-between">
                        <span>Qty: {o.quantity}</span>
                        <span className="text-gray-600">{new Date(o.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                    {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrganizationSelfPage
