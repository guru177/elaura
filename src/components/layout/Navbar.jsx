import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiMenu, HiX } from 'react-icons/hi';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'HOME' },
  { path: '#', label: 'ABOUT' },
  { path: '#', label: 'COURSES' },
  { path: '#', label: 'GALLERY' },
  { path: '#', label: 'CONTACT' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Left: Nav Links (Desktop) */}
        <div className="navbar__left">
          <ul className="navbar__nav">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Center: Logo */}
        <div className="navbar__center">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-box">E</span>
            <span className="navbar__logo-text">LAURA</span>
            <span className="navbar__logo-sub">academy</span>
          </Link>
        </div>

        {/* Right: Socials (Desktop) & Hamburger (Mobile) */}
        <div className="navbar__right">
          <div className="navbar__socials">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="X (Twitter)"><FaXTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Youtube"><FaYoutube /></a>
          </div>
          <button className="navbar__hamburger" onClick={() => setIsMobileMenuOpen(true)}>
            <HiMenu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`navbar__mobile-sidebar ${isMobileMenuOpen ? 'navbar__mobile-sidebar--open' : ''}`}>
        <button className="navbar__mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
          <HiX size={28} />
        </button>
        <ul className="navbar__mobile-nav">
          {navLinks.map((link, idx) => (
            <li key={link.label} style={{ animationDelay: `${idx * 0.1}s` }} className={isMobileMenuOpen ? 'mobile-link-animate' : ''}>
              <NavLink 
                to={link.path} 
                className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="navbar__mobile-socials">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="X (Twitter)"><FaXTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="Youtube"><FaYoutube /></a>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="navbar__mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
