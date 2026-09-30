import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2.5rem' }} className="footer-layout">
        
        {/* Column 1: Brand Info */}
        <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {/* Scissors and Comb SVG logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '2.25rem', height: '2.25rem', color: 'white' }}>
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="9.8" y1="8.2" x2="21" y2="12" />
              <line x1="9.8" y1="15.8" x2="21" y2="12" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '700', fontSize: '1.625rem', lineHeight: '1.1', letterSpacing: '0.025em' }}>Salon</span>
              <span style={{ fontWeight: '500', fontSize: '11px', letterSpacing: '0.8px', opacity: 0.8, textTransform: 'uppercase' }}>Management Portal</span>
            </div>
          </div>
          <p style={{ fontSize: '15px', opacity: 0.8, lineHeight: '1.625', maxWidth: '24rem', margin: 0 }}>Beauty. Style. Confidence.</p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '1.5rem', marginTop: 0 }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'all 0.2s', fontSize: '15px' }} onMouseOver={(e) => {e.target.style.color='white'; e.target.style.paddingLeft='4px'}} onMouseOut={(e) => {e.target.style.color='rgba(255,255,255,0.75)'; e.target.style.paddingLeft='0'}}>Home</Link></li>
            <li><Link to="/bookappointment" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'all 0.2s', fontSize: '15px' }} onMouseOver={(e) => {e.target.style.color='white'; e.target.style.paddingLeft='4px'}} onMouseOut={(e) => {e.target.style.color='rgba(255,255,255,0.75)'; e.target.style.paddingLeft='0'}}>Book Appointment</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '1.5rem', marginTop: 0 }}>Customer Care</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
            <li><Link to="/about" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'all 0.2s', fontSize: '15px' }} onMouseOver={(e) => {e.target.style.color='white'; e.target.style.paddingLeft='4px'}} onMouseOut={(e) => {e.target.style.color='rgba(255,255,255,0.75)'; e.target.style.paddingLeft='0'}}>About Us</Link></li>
            <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'all 0.2s', fontSize: '15px' }} onMouseOver={(e) => {e.target.style.color='white'; e.target.style.paddingLeft='4px'}} onMouseOut={(e) => {e.target.style.color='rgba(255,255,255,0.75)'; e.target.style.paddingLeft='0'}}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '1.5rem', marginTop: 0 }}>Follow Us</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a href="#" style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.2s' }} aria-label="Facebook" onMouseOver={(e) => {e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.color='var(--color-primary)'; e.currentTarget.style.transform='scale(1.1)'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='white'; e.currentTarget.style.transform='scale(1)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'colors 0.2s' }}>
                <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6.5c0-.83.67-1.5 1.5-1.5H15V2h-2.5C9.92 2 8 3.92 8 6.5V8z"/>
              </svg>
            </a>
            <a href="#" style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.2s' }} aria-label="Instagram" onMouseOver={(e) => {e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.color='var(--color-primary)'; e.currentTarget.style.transform='scale(1.1)'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='white'; e.currentTarget.style.transform='scale(1)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'colors 0.2s' }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.2s' }} aria-label="Twitter" onMouseOver={(e) => {e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.color='var(--color-primary)'; e.currentTarget.style.transform='scale(1.1)'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='white'; e.currentTarget.style.transform='scale(1)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'colors 0.2s' }}>
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'all 0.2s' }} aria-label="YouTube" onMouseOver={(e) => {e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.color='var(--color-primary)'; e.currentTarget.style.transform='scale(1.1)'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='white'; e.currentTarget.style.transform='scale(1)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'colors 0.2s' }}>
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: '72rem', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', opacity: 0.7, margin: 0 }}>&copy; 2026 Salon Management Portal. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

