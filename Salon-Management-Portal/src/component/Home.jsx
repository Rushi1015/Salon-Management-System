import React from 'react'
import '../css/Home.css'
import { useNavigate } from 'react-router-dom'
import salonImage from '../assets/salon.png'

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', backgroundColor: 'var(--color-white)', fontFamily: 'sans-serif' }}>
      {/* 1. Hero Section (Split View) */}
      <div className="public-hero">
        <div className="public-hero-text">
          <div className="public-hero-content">
            <h1 className="public-hero-title">
              Look Good, <br /> Feel Great!
            </h1>
            <p className="public-hero-subtitle">
              Professional care for your hair, beard & skin. Book your appointment today and experience the best salon service.
            </p>
            <button 
              className="btn-large" 
              onClick={() => navigate('/bookappointment')}
            >
              Book Appointment
            </button>
          </div>
        </div>
        <div className="public-hero-image">
          <img src={salonImage} alt="Salon Interior" className="public-hero-img-element" />
        </div>
      </div>

      {/* 2. Feature Cards Section */}
      <div className="public-section">
        <div className="feature-grid">
          <div className="feature-card">
            <h3 className="feature-title">Professional Staff</h3>
            <p className="feature-desc">Experienced & certified stylists</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Quality Products</h3>
            <p className="feature-desc">We use premium quality products</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Hygienic & Safe</h3>
            <p className="feature-desc">Clean, sanitized & safe environment</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Affordable Price</h3>
            <p className="feature-desc">Best services at reasonable price</p>
          </div>
        </div>
      </div>

      {/* 3. Our Popular Services Section */}
      <div className="public-section public-section-alt">
        <div className="public-section-header">
          <h2 className="public-section-title">Our Popular Services</h2>
          <p className="public-section-subtitle">Explore our professional range of beauty and styling treatments.</p>
        </div>
        
        <div className="service-grid">
          {/* Card 1 */}
          <div className="service-card">
            <div className="service-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="9.8" y1="8.2" x2="21" y2="12" />
                <line x1="9.8" y1="15.8" x2="21" y2="12" />
              </svg>
            </div>
            <h3 className="service-title">Haircut & Styling</h3>
            <p className="service-price">Starting at $35</p>
            <p className="feature-desc">Custom haircuts, fades, blowouts, and professional styling tailored to your face shape.</p>
          </div>

          {/* Card 2 */}
          <div className="service-card">
            <div className="service-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </div>
            <h3 className="service-title">Coloring & Highlights</h3>
            <p className="service-price">Starting at $75</p>
            <p className="feature-desc">Full coloring, balayage, ombre, and root touch-ups using premium ammonia-free products.</p>
          </div>

          {/* Card 3 */}
          <div className="service-card">
            <div className="service-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="service-icon">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <h3 className="service-title">Beard & Grooming</h3>
            <p className="service-price">Starting at $25</p>
            <p className="feature-desc">Precision beard trims, hot towel shaves, and grooming products to keep you looking sharp.</p>
          </div>
        </div>
      </div>

      {/* 4. Opening Hours & Contact Promo */}
      <div className="public-section">
        <div className="promo-container">
          <div className="promo-hours">
            <h2 className="promo-title">Opening Hours</h2>
            <ul className="promo-hours-list">
              <li className="promo-hours-item">
                <span>Monday - Friday</span>
                <span>9:00 AM - 8:00 PM</span>
              </li>
              <li className="promo-hours-item">
                <span>Saturday</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="promo-hours-item">
                <span>Sunday</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Closed</span>
              </li>
            </ul>
          </div>
          <div className="promo-content">
            <h2 className="promo-title">First Visit Special</h2>
            <p className="promo-desc">
              Get <strong>10% OFF</strong> your first salon treatment! Use the promo code <strong>FIRST10</strong> when booking your appointment.
            </p>
            <button 
              className="btn-large" 
              onClick={() => navigate('/bookappointment')}
            >
              Book Your Session
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home
