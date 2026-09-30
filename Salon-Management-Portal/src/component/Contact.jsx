import React from 'react'
import '../css/Contact.css'
import receptionImage from '../assets/reception.png'

function Contact() {
  return (
    <div className="contact-page-wrap">

      {/* 1. Hero Split Section */}
      <div className="contact-hero">
        <div className="contact-hero-text">
          <div className="contact-hero-inner">
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-subtitle">
              We'd love to hear from you. Get in touch with us for any queries or support.
            </p>
          </div>
        </div>
        <div className="contact-hero-image">
          <img src={receptionImage} alt="Salon Reception" />
        </div>
      </div>

      {/* 2. Contact Info Cards Section */}
      <div className="contact-info-section">
        <div className="contact-info-grid">

          {/* Card 1: Our Location */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3>Our Location</h3>
            <p>
              123, Beauty Street,<br />
              Ahmedabad,<br />
              Gujarat, India - 380001
            </p>
          </div>

          {/* Card 2: Call Us */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3>Call Us</h3>
            <p>
              +91 98765 43210<br />
              +91 98765 43211
            </p>
          </div>

          {/* Card 3: Email Us */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3>Email Us</h3>
            <p>
              support@salonportal.com<br />
              info@salonportal.com
            </p>
          </div>

          {/* Card 4: Working Hours */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Working Hours</h3>
            <p>
              Mon - Sat: 9:00 AM - 8:00 PM<br />
              Sunday: 10:00 AM - 6:00 PM
            </p>
          </div>

        </div>
      </div>

      {/* 3. Send Us a Message Form Section */}
      <div className="contact-form-section">
        <form className="contact-form-card" onSubmit={(e) => e.preventDefault()}>
          <h2 className="contact-form-title">Send Us a Message</h2>

          <div className="contact-form-group">
            <label htmlFor="name" className="contact-form-label">Your Name</label>
            <input type="text" id="name" placeholder="Enter your name" className="contact-form-input" required />
          </div>

          <div className="contact-form-group">
            <label htmlFor="email" className="contact-form-label">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" className="contact-form-input" required />
          </div>

          <div className="contact-form-group">
            <label htmlFor="subject" className="contact-form-label">Subject</label>
            <input type="text" id="subject" placeholder="Enter subject" className="contact-form-input" required />
          </div>

          <div className="contact-form-group">
            <label htmlFor="message" className="contact-form-label">Message</label>
            <textarea id="message" rows="5" placeholder="Type your message here..." className="contact-form-textarea" required></textarea>
          </div>

          <button type="submit" className="contact-submit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Send Message</span>
          </button>
        </form>
      </div>

    </div>
  )
}

export default Contact
