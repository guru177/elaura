import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLinkedinIn, FaInstagram, FaFacebookF, FaArrowUp 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import ctaBg from '../../assets/footer_cta_bg.png';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        
        {/* Top CTA Section */}
        <div 
          className="footer__cta"
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${ctaBg})` }}
        >
          <h2>Ready to accelerate your career<span className="text-blue">?</span></h2>
          <p className="footer__cta-sub">let's build your future</p>
          <Link to="/contact" className="footer__btn">
            Apply Now <span className="arrow">→</span>
          </Link>
        </div>

        {/* Middle Section */}
        <div className="footer__middle">
          <div className="footer__left">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">E</div>
              <span className="footer__logo-text">LAURA <span className="footer__logo-light">academy</span></span>
            </Link>
            <p className="footer__desc">
              Empowering minds, shaping futures. Join thousands of students who transformed their careers with Elura Academy.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="X (Twitter)"><FaXTwitter /></a>
            </div>
          </div>

          <div className="footer__right">
            <div className="footer__links-main">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer__bottom">
          <p>@{new Date().getFullYear()} . All Rights Reserved Elura Academy. Powered by Crafteluxe</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
