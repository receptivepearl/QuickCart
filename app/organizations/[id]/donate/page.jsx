'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'

const DonatePage = () => {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [org, setOrg] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await axios.get(`/api/organizations/${id}`)
        if (data.success) setOrg(data.organization)
        else setMessage(data.message || 'Failed to load')
      } catch (e) {
        setMessage(e.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) run()
  }, [id])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      const { data } = await axios.post('/api/donations', {
        organizationId: id,
        quantity: Number(quantity),
        description
      })
      if (data.success) {
        setMessage('Thank you for your donation!')
        router.push(`/org/dashboard`)
      } else {
        setMessage(data.message || 'Failed to donate')
      }
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className='px-6 md:px-16 lg:px-32 py-8 max-w-xl'>
        {loading && <p>Loading…</p>}
        {org && (
          <div>
            <h1 className='text-2xl font-medium mb-1'>Donate to {org.name}</h1>
            <p className='text-gray-600 mb-6'>{org.address}</p>
            <form onSubmit={onSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm mb-1'>How many products?</label>
                <input type='number' min={1} value={quantity} onChange={e=>setQuantity(e.target.value)} className='w-full border rounded px-3 py-2' required />
              </div>
              <div>
                <label className='block text-sm mb-1'>What are you donating? (optional)</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} className='w-full border rounded px-3 py-2' rows={4} />
              </div>
              <button disabled={submitting} className='bg-black text-white px-4 py-2 rounded-full'>
                {submitting ? 'Placing…' : 'Place donation'}
              </button>
              {message && <p className='text-sm mt-2'>{message}</p>}
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default DonatePage
