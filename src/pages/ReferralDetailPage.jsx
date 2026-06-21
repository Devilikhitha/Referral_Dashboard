import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const BASE_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'
function formatDate(iso) { return iso ? iso.replace(/-/g, '/') : '' }
function formatProfit(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export default function ReferralDetailPage() {
  const { id } = useParams()
  const token = Cookies.get('jwt_token')
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await fetch(`${BASE_URL}?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
        const json = await res.json()
        if (!res.ok) { setNotFound(true); return }
        const d = json?.data ?? json
        if (d && typeof d === 'object' && !Array.isArray(d)) {
          if (d.id !== undefined && String(d.id) === String(id)) { setReferral(d); return }
          if (Array.isArray(d.referrals)) {
            const found = d.referrals.find(r => String(r.id) === String(id))
            if (found) { setReferral(found); return }
          }
        }
        if (Array.isArray(d)) {
          const found = d.find(r => String(r.id) === String(id))
          if (found) { setReferral(found); return }
        }
        setNotFound(true)
      } catch { setNotFound(true) }
      finally { setLoading(false) }
    }
    fetchDetail()
  }, [id])

  return (
    <>
      <Navbar />
      <main className="page-container">
        {loading ? (
          <div className="loading-state"><div className="spinner" /><p>Loading referral…</p></div>
        ) : notFound || !referral ? (
          <div className="detail-not-found">
            <h2>Referral not found</h2>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>No referral found with ID {id}.</p>
            <Link to="/" className="btn-primary">← Back to dashboard</Link>
          </div>
        ) : (
          <>
            <Link to="/" className="detail-back">← Back to dashboard</Link>
            <h1 className="detail-heading">Referral Details</h1>
            <p className="detail-subtitle">Full information for this referral partner.</p>

            <div className="detail-card">
              <div className="detail-card-header">
                <span className="detail-partner-name">{referral.name}</span>
                <span className="detail-service-badge">{referral.serviceName}</span>
              </div>
              <dl className="detail-dl">
                <div className="detail-row">
                  <dt className="detail-dt">Referral ID</dt>
                  <dd className="detail-dd">{referral.id}</dd>
                </div>
                <div className="detail-row">
                  <dt className="detail-dt">Name</dt>
                  <dd className="detail-dd" style={{fontWeight:700}}>{referral.name}</dd>
                </div>
                <div className="detail-row">
                  <dt className="detail-dt">Service Name</dt>
                  <dd className="detail-dd">{referral.serviceName}</dd>
                </div>
                <div className="detail-row">
                  <dt className="detail-dt">Date</dt>
                  <dd className="detail-dd">{formatDate(referral.date)}</dd>
                </div>
                <div className="detail-row">
                  <dt className="detail-dt">Profit</dt>
                  <dd className="detail-dd" style={{fontWeight:700}}>{formatProfit(referral.profit)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
