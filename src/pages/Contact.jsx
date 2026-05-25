import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/send_contact.php' : '/backend/send_contact.php';
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="page-hero">
        <motion.div 
          className="page-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Get in <span>Touch</span></h1>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>
      </section>

      {/* Contact Details Grid */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="info-cards-grid">
            <motion.div className="info-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="icon-wrapper"><HiOutlineLocationMarker /></div>
              <h3>Our Location</h3>
              <p>Pancode, Perumbavoor - Puthenkurish Road</p>
            </motion.div>
            <motion.div className="info-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="icon-wrapper"><HiOutlinePhone /></div>
              <h3>Call Us</h3>
              <p>+91 123 456 7890<br/>Mon-Fri, 9am - 6pm</p>
            </motion.div>
            <motion.div className="info-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="icon-wrapper"><HiOutlineMail /></div>
              <h3>Email Us</h3>
              <p>lead@elauraacademy.com<br/>Support 24/7</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section (Image Left, Form Right) */}
      <section className="contact-form-section">
        <div className="contact-container">
          <div className="form-split">
            {/* Left Image */}
            <motion.div 
              className="form-split-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/contact-img.png" alt="Contact Elaura" />
              <div className="image-overlay">
                <h2>Ready to Start?</h2>
                <p>Join thousands of successful students who transformed their careers with Elaura.</p>
              </div>
            </motion.div>

            {/* Right Form */}
            <motion.div 
              className="form-split-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="contact-form-wrapper">
                <h3>Send a Message</h3>
                
                {status === 'success' && (
                  <div className="alert success">
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </div>
                )}
                {status === 'error' && (
                  <div className="alert error">
                    Oops! Something went wrong. Please try again.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Your Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                    </div>
                  </div>
                  
                  <div className="input-row">
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" />
                    </div>
                    <div className="input-group">
                      <label>Subject</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" />
                    </div>
                  </div>

                  <div className="input-group full-width">
                    <label>Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Write your message here..." rows="5"></textarea>
                  </div>

                  <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.3524673686884!2d76.3533816153315!3d9.987747892858852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d50012c8b05%3A0x7d6f54b1f6920f32!2sPancode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1716616016142!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Location"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
