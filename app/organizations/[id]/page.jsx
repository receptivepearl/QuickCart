'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useParams } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'

const OrgDetailPage = () => {
  const params = useParams()
  const { user } = useUser()
  const { getToken } = useAuth()
  const [org, setOrg] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const id = params?.id
    if (!id) return
    const fetchOrg = async () => {
      const res = await fetch(`/api/organization/${id}`)
      const data = await res.json()
      if (data.success) setOrg(data.organization)
    }
    const fetchSummary = async () => {
      const sp = new URLSearchParams({ organizationId: String(id) })
      const res = await fetch(`/api/donation/list?${sp.toString()}`)
      const data = await res.json()
      if (data.success) setSummary({ totalOrders: data.totalOrders, totalProducts: data.totalProducts })
    }
    fetchOrg()
    fetchSummary()
  }, [params?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to place a donation order.')
      return
    }
    setSubmitting(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/donation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ organizationId: org._id, quantity: Number(quantity), note }),
      })
      const data = await res.json()
      if (data.success) {
        setQuantity(1)
        setNote('')
        alert('Thank you! Your donation order has been placed.')
      } else {
        alert(data.message || 'Something went wrong')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        {!org ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{org.name}</h1>
              <p className="text-sm text-gray-600 mb-4">{org.description}</p>
              <p className="text-sm">{org.addressLine1}{org.addressLine2 ? `, ${org.addressLine2}` : ''}, {org.city}, {org.state} {org.postalCode}</p>
              {summary && (
                <div className="mt-4 text-sm text-gray-700">
                  <p>Total donation orders: <b>{summary.totalOrders}</b></p>
                  <p>Total products donated: <b>{summary.totalProducts}</b></p>
                </div>
              )}
            </div>
            <div>
              {org.verified ? (
                <form onSubmit={handleSubmit} className="border rounded-lg p-4">
                  <h2 className="text-lg font-medium mb-3">Place a donation order</h2>
                  <label className="block text-sm mb-1">Quantity of products</label>
                  <input type="number" min={1} className="w-full border rounded px-3 py-2 mb-3" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  <label className="block text-sm mb-1">Description of what you’re donating</label>
                  <textarea className="w-full border rounded px-3 py-2 mb-3" rows={4} placeholder="e.g., 2 packs of pads, 1 box of tampons" value={note} onChange={(e) => setNote(e.target.value)} />
                  <button disabled={submitting} className="bg-gray-800 text-white rounded px-4 py-2 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Donation'}</button>
                </form>
              ) : (
                <div className="border rounded-lg p-4 text-sm text-gray-700">
                  This organization is not yet verified. Please consider an in-person donation.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default OrgDetailPage
