import React from 'react';
import { motion } from 'framer-motion';
import './Contact.css'; 

const ComingSoon = ({ page }) => (
  <div className="contact-page">
    <section className="page-hero">
      <motion.div 
        className="page-hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>{page}</h1>
        <p>This page is currently under construction. Stay tuned for updates!</p>
      </motion.div>
    </section>

    <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '60px 20px', textAlign: 'center', background: '#ffffff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>We're working on something amazing.</h2>
        <p style={{ color: '#64748b' }}>Please check back later to see the full {page.toLowerCase()} experience.</p>
    </div>
  </div>
);

export default ComingSoon;
