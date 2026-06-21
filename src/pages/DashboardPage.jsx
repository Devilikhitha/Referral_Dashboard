import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const BASE_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'
const PAGE_SIZE = 10

function formatDate(iso) { return iso ? iso.replace(/-/g, '/') : '' }
function formatProfit(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

// Icon map for metrics
const ICONS = {
  default: '💲',
  balance: '$',
  discount: '=',
  referral: '🔗',
  amount: '$',
  commission: '%',
  earning: '🔥',
  transfer: '↔',
}

function MetricIcon({ label }) {
  const l = (label || '').toLowerCase()
  let icon = '💲'
  let bg = '#5c6bc0'
  if (l.includes('balance')) { icon = '$'; bg = '#5c6bc0' }
  else if (l.includes('discount') && l.includes('percent')) { icon = '='; bg = '#5c6bc0' }
  else if (l.includes('referral') && !l.includes('earning')) { icon = '🔗'; bg = '#7c6bc0' }
  else if (l.includes('discount') && l.includes('amount')) { icon = '🏷'; bg = '#9c6bc0' }
  else if (l.includes('commission') && l.includes('amount')) { icon = '%'; bg = '#5c6bc0' }
  else if (l.includes('earning')) { icon = '🔥'; bg = '#e67e22' }
  else if (l.includes('commission') && l.includes('discount')) { icon = '%'; bg = '#5c6bc0' }
  else if (l.includes('bank') || l.includes('transfer')) { icon = '↔'; bg = '#6c8bc0' }
  return (
    <div className="metric-icon" style={{ background: bg, color: '#fff', fontFamily: 'monospace', fontSize: '.8rem', fontWeight: 700 }}>
      {icon}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const token = Cookies.get('jwt_token')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState({ link: false, code: false })
  const searchTimerRef = useRef(null)

  const fetchReferrals = useCallback(async (searchVal, sortVal) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (searchVal) params.set('search', searchVal)
      if (sortVal) params.set('sort', sortVal)
      const url = `${BASE_URL}${params.toString() ? '?' + params.toString() : ''}`
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (!res.ok) {
        setError(`${json?.message || 'Failed to load referrals'} (${res.status})`)
        setData(null)
        return
      }
      setData(json?.data ?? json)
      setPage(1)
    } catch {
      setError('Network error. Please try again.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchReferrals('', 'desc') }, [])

  function handleSearchChange(e) {
    const val = e.target.value
    setSearch(val)
    clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => fetchReferrals(val, sort), 350)
  }

  function handleSortChange(e) {
    const val = e.target.value
    setSort(val)
    fetchReferrals(search, val)
  }

  async function handleCopy(text, field) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(prev => ({ ...prev, [field]: true }))
      setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000)
    } catch {}
  }

  const referrals = data?.referrals ?? []
  const totalPages = Math.ceil(referrals.length / PAGE_SIZE)
  const pageReferrals = referrals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const fromEntry = referrals.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const toEntry = Math.min(page * PAGE_SIZE, referrals.length)
  const metrics = data?.metrics ?? []
  const serviceSummary = data?.serviceSummary ?? {}
  const referral = data?.referral ?? {}

  return (
    <>
      <Navbar />
      <main className="page-container">
        <header className="dash-header">
          <h1>Referral Dashboard</h1>
          <p>Track your referrals, earnings, and partner activity in one place.</p>
        </header>

        {error && <div className="alert-error" role="alert">{error}</div>}

        {loading && !data ? (
          <div className="loading-state"><div className="spinner" /><p>Loading…</p></div>
        ) : (
          <>
            {/* Overview */}
            <section className="card" role="region" aria-label="Overview metrics">
              <h2 className="section-title">Overview</h2>
              <div className="metrics-grid">
                {metrics.map(m => (
                  <div key={m.id} className="metric-card">
                    <MetricIcon label={m.label} />
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Service Summary */}
            <section className="card" role="region" aria-label="Service summary">
              <h2 className="section-title">Service summary</h2>
              <div className="service-summary-grid">
                <div className="summary-item">
                  <div className="summary-label">Service</div>
                  <div className="summary-value accent">{serviceSummary.service ?? '—'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Your Referrals</div>
                  <div className="summary-value">{serviceSummary.yourReferrals ?? '—'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Active Referrals</div>
                  <div className="summary-value">{serviceSummary.activeReferrals ?? '—'}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Total Ref. Earnings</div>
                  <div className="summary-value">{serviceSummary.totalRefEarnings ?? '—'}</div>
                </div>
              </div>
            </section>

            {/* Share Referral */}
            <section className="card" role="region" aria-label="Share referral">
              <h2 className="section-title">Refer friends and earn more</h2>
              <div className="referral-share-grid">
                <div>
                  <div className="share-field-label">Your Referral Link</div>
                  <div className="share-input-row">
                    <input className="share-input" value={referral.link ?? ''} readOnly aria-label="Your referral link" />
                    <button className={`btn-copy${copied.link ? ' copied' : ''}`} onClick={() => handleCopy(referral.link ?? '', 'link')}>
                      {copied.link ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="share-field-label">Your Referral Code</div>
                  <div className="share-input-row">
                    <input className="share-input" value={referral.code ?? ''} readOnly aria-label="Your referral code" />
                    <button className={`btn-copy${copied.code ? ' copied' : ''}`} onClick={() => handleCopy(referral.code ?? '', 'code')}>
                      {copied.code ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* All Referrals */}
            <section className="card">
              <h2 className="section-title">All referrals</h2>

              <div className="table-top">
                <div className="search-row">
                  <span className="search-label-text">Search</span>
                  <div className="search-divider" />
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Name or service…"
                    value={search}
                    onChange={handleSearchChange}
                    aria-label="Search referrals"
                  />
                </div>
                <div className="sort-row">
                  Sort by date
                  <select className="sort-select" value={sort} onChange={handleSortChange}>
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageReferrals.length === 0 ? (
                      <tr className="empty-row"><td colSpan={4}>No matching entries</td></tr>
                    ) : pageReferrals.map(row => (
                      <tr key={row.id}
                        onClick={() => navigate(`/referral/${row.id}`)}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && navigate(`/referral/${row.id}`)}>
                        <td>{row.name}</td>
                        <td>{row.serviceName}</td>
                        <td>{formatDate(row.date)}</td>
                        <td className="profit-cell">{formatProfit(row.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {referrals.length > 0 && (
                <div className="pagination-row">
                  <span className="pagination-summary">Showing {fromEntry}–{toEntry} of {referrals.length} entries</span>
                  <div className="pagination-controls">
                    <button className="btn-page btn-page-text" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
                    {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`btn-page${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="btn-page btn-page-text" onClick={() => setPage(p => p + 1)} disabled={page === totalPages || totalPages === 0}>Next</button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
