import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="notfound-shell">
      <div>
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-body">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">← Back to dashboard</Link>
      </div>
    </div>
  )
}
