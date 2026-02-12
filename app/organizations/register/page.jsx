'use client'
import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'

const RegisterOrganizationPage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!navigator.geolocation) {
      setMessage('Geolocation not supported')
      return
    }
    setSubmitting(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const { data } = await axios.post('/api/organizations/register', {
          name, description, address, lat, lng
        })
        if (data.success) {
          setMessage('Organization registered and verified!')
          setName(''); setDescription(''); setAddress('')
        } else {
          setMessage(data.message || 'Failed to register')
        }
      } catch (err) {
        setMessage(err.message)
      } finally {
        setSubmitting(false)
      }
    }, (err) => {
      setMessage(err.message || 'Location permission denied')
      setSubmitting(false)
    })
  }

  return (
    <>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-32 py-8 max-w-2xl'>
        <h1 className='text-2xl font-medium mb-4'>Register your organization</h1>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm mb-1'>Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className='w-full border rounded px-3 py-2' required />
          </div>
          <div>
            <label className='block text-sm mb-1'>Address</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} className='w-full border rounded px-3 py-2' />
          </div>
          <div>
            <label className='block text-sm mb-1'>Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className='w-full border rounded px-3 py-2' rows={4} />
          </div>
          <button disabled={submitting} className='bg-black text-white px-4 py-2 rounded-full'>
            {submitting ? 'Submitting…' : 'Register'}
          </button>
          {message && <p className='text-sm mt-2'>{message}</p>}
        </form>
      </div>
      <Footer />
    </>
  )
}

export default RegisterOrganizationPage
