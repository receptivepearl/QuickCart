'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useUser } from '@clerk/nextjs'

function isAdmin(user) {
  const ids = (process.env.NEXT_PUBLIC_ADMIN_USER_IDS || '').split(',').map(s=>s.trim()).filter(Boolean)
  return user && ids.includes(user.id)
}

const AdminPage = () => {
  const { user, isLoaded } = useUser()
  const [pending, setPending] = useState([])
  const [stats, setStats] = useState(null)

  const refresh = async () => {
    const [pRes, sRes] = await Promise.all([
      fetch('/api/organization/pending'),
      fetch('/api/organization/stats')
    ])
    const p = await pRes.json(); const s = await sRes.json()
    if (p.success) setPending(p.organizations)
    if (s.success) setStats(s.stats)
  }

  const approve = async (orgId, verified=true) => {
    await fetch('/api/organization/approve', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ orgId, verified }) })
    await refresh()
  }

  useEffect(() => { refresh() }, [])

  if (!isLoaded) return null
  if (!isAdmin(user)) return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8"><p>Forbidden</p></div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-2xl font-semibold mb-4">Administrator</h1>
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="border rounded p-4"><p className="text-sm">Organizations</p><p className="text-2xl font-semibold">{stats.orgCount}</p></div>
            <div className="border rounded p-4"><p className="text-sm">Users</p><p className="text-2xl font-semibold">{stats.userCount}</p></div>
            <div className="border rounded p-4"><p className="text-sm">Total orders</p><p className="text-2xl font-semibold">{stats.totalOrders}</p></div>
            <div className="border rounded p-4"><p className="text-sm">Products donated</p><p className="text-2xl font-semibold">{stats.totalProducts}</p></div>
          </div>
        )}

        <h2 className="text-xl font-medium mb-2">Pending verifications</h2>
        <ul className="grid gap-3">
          {pending.map(o => (
            <li key={o._id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-sm text-gray-600">{o.addressLine1}{o.addressLine2 ? `, ${o.addressLine2}` : ''}, {o.city}, {o.state} {o.postalCode}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>approve(o._id, true)} className="bg-green-700 text-white px-3 py-1.5 rounded text-sm">Approve</button>
                  <button onClick={()=>approve(o._id, false)} className="bg-red-700 text-white px-3 py-1.5 rounded text-sm">Reject</button>
                </div>
              </div>
            </li>
          ))}
          {pending.length === 0 && <p className="text-sm text-gray-500">No pending organizations.</p>}
        </ul>
      </div>
      <Footer />
    </>
  )
}

export default AdminPage
