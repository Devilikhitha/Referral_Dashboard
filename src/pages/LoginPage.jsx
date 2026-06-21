import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const LOGIN_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSignIn() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (res.ok && json?.data?.token) {
        Cookies.set('jwt_token', json.data.token)
        navigate('/')
      } else {
        setError(json?.message || 'Invalid email or password')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">Go Business</div>
        <p className="login-tagline">Sign in to open your referral dashboard.</p>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" className="form-input" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" className="form-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        <button className="btn-signin" onClick={handleSignIn} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {error && <div className="login-error" role="alert">{error}</div>}
      </div>
    </div>
  )
}
