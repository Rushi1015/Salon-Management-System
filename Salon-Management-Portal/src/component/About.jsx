import '../css/About.css'
import salonImage from '../assets/salon.png'
import stylistImage from '../assets/stylist.png'

function About() {
  return (
    <div className="about-page-wrap">

      {/* 1. Hero Section */}
      <div className="about-hero">
        <div className="about-hero-text">
          <div className="about-hero-inner">
            <h1 className="about-hero-title">About Us</h1>
            <p className="about-hero-subtitle">
              We are passionate about making you look good and feel confident every single day.
            </p>
          </div>
        </div>
        <div className="about-hero-image">
          <img src={salonImage} alt="Salon Interior" />
        </div>
      </div>

      {/* 2. Our Story Section */}
      <div className="about-story-section">
        <div className="about-story-inner">
          <div className="about-story-text">
            <h2 className="about-section-title">Our Story</h2>
            <p className="about-section-body">
              Salon Management Portal was founded with a simple mission – to provide high-quality salon services in a comfortable and welcoming environment. Our team of expert stylists is dedicated to helping you achieve your desired look with professionalism and care.
            </p>
          </div>
          <div className="about-story-image-wrap">
            <div className="about-story-image-bg"></div>
            <img src={stylistImage} alt="Stylist cutting hair" />
          </div>
        </div>
      </div>

      {/* 3. Mission & Vision Section */}
      <div className="about-mv-section">
        <div className="about-mv-inner">

          {/* Card 1: Our Mission */}
          <div className="about-mv-card">
            <div className="about-mv-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="about-mv-content">
              <h3>Our Mission</h3>
              <p>
                To deliver exceptional beauty and grooming services using the best techniques and premium products.
              </p>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="about-mv-card">
            <div className="about-mv-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="about-mv-content">
              <h3>Our Vision</h3>
              <p>
                To be the most trusted and preferred salon brand known for quality, hygiene and customer satisfaction.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Our Values Section */}
      <div className="about-values-section">
        <div className="about-values-inner">

          <div className="about-values-image-wrap">
            <div className="about-values-image-bg"></div>
            <img src={salonImage} alt="Salon Interior" />
          </div>

          <div className="about-values-list-wrap">
            <h2 className="about-section-title">Our Values</h2>
            <ul className="about-values-list">
              {['Professionalism', 'Quality Service', 'Customer Care', 'Integrity & Trust'].map((val) => (
                <li key={val} className="about-values-item">
                  <div className="about-values-check">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  )
}

export default About
