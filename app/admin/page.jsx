'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'

const AdminPage = () => {
  const [stats, setStats] = useState(null)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    try {
      const [{ data: s }, { data: orgs }] = await Promise.all([
        axios.get('/api/admin'),
        axios.get('/api/organizations/list?verified=false'),
      ])
      if (s.success) setStats(s.stats)
      if (orgs.success) setPending(orgs.organizations)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const approve = async (id, verified=true) => {
    setMessage('')
    try {
      const { data } = await axios.post('/api/organizations/approve', { organizationId: id, verified })
      if (data.success) {
        setMessage('Updated')
        setPending(prev => prev.filter(p => p._id !== id))
        fetchData()
      } else setMessage(data.message || 'Failed')
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-32 py-8'>
        <h1 className='text-2xl font-medium mb-6'>Admin Dashboard</h1>
        {loading && <p>Loading…</p>}
        {error && !loading && <p className='text-red-600'>{error}</p>}
        {stats && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            <div className='border rounded p-4'><div className='text-sm text-gray-500'>Organizations</div><div className='text-2xl font-semibold'>{stats.organizations}</div></div>
            <div className='border rounded p-4'><div className='text-sm text-gray-500'>Users</div><div className='text-2xl font-semibold'>{stats.users}</div></div>
            <div className='border rounded p-4'><div className='text-sm text-gray-500'>Products Donated</div><div className='text-2xl font-semibold'>{stats.totalProductsDonated}</div></div>
            <div className='border rounded p-4'><div className='text-sm text-gray-500'>Products (Catalog)</div><div className='text-2xl font-semibold'>{stats.products}</div></div>
          </div>
        )}
        <div className='border rounded'>
          <div className='p-4 border-b font-medium flex items-center justify-between'>
            <span>Organizations pending approval</span>
            {message && <span className='text-sm'>{message}</span>}
          </div>
          <ul className='divide-y'>
            {pending.map(p => (
              <li key={p._id} className='p-4 flex items-center justify-between'>
                <div>
                  <div className='font-medium'>{p.name}</div>
                  <div className='text-xs text-gray-600'>{p.address}</div>
                </div>
                <div className='flex gap-2'>
                  <button className='text-sm bg-black text-white px-3 py-1.5 rounded-full' onClick={() => approve(p._id, true)}>Approve</button>
                  <button className='text-sm border px-3 py-1.5 rounded-full' onClick={() => approve(p._id, false)}>Reject</button>
                </div>
              </li>
            ))}
            {pending.length === 0 && <li className='p-4 text-sm text-gray-500'>No pending organizations</li>}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminPage
