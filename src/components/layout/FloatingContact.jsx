import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaArrowUp } from 'react-icons/fa';
import './FloatingContact.css';

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show scroll-to-top button only when scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="floating-contact">
      {/* Scroll to Top */}
      <button 
        className={`floating-btn floating-top ${isVisible ? 'visible' : ''}`} 
        onClick={scrollToTop} 
        aria-label="Scroll to Top"
      >
        <FaArrowUp />
      </button>

      {/* Phone */}
      <a 
        href="tel:+1234567890" 
        className="floating-btn floating-phone" 
        aria-label="Call Us"
      >
        <FaPhoneAlt />
      </a>

      {/* WhatsApp */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-btn floating-wa" 
        aria-label="WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default FloatingContact;
