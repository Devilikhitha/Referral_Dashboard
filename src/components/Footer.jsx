import React from 'react'

export default function Footer() {
  return (
    <footer style={{background:'#1a1a2e', color:'rgba(255,255,255,.45)', padding:'1.75rem 2.5rem', marginTop:'3rem'}}>
      <div style={{maxWidth:'900px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'.75rem'}}>
        <span style={{fontWeight:700, color:'#fff', fontSize:'.95rem'}}>Go Business</span>
        <nav aria-label="Footer" style={{display:'flex', gap:'1.5rem'}}>
          <a href="#" style={{fontSize:'.8rem', color:'rgba(255,255,255,.45)'}}>About</a>
          <a href="#" style={{fontSize:'.8rem', color:'rgba(255,255,255,.45)'}}>Privacy</a>
        </nav>
      </div>
      <div style={{maxWidth:'900px', margin:'.5rem auto 0', textAlign:'right'}}>
        <span style={{fontSize:'.75rem', color:'rgba(255,255,255,.3)'}}>© 2024 Go Business</span>
      </div>
    </footer>
  )
}
