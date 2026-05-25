import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import './LeadPopup.css';

const LeadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // Check if the user has already submitted the form
    if (localStorage.getItem('elura_lead_submitted') === 'true') {
      return;
    }

    let initialTimer;

    const showPopup = () => {
      // Only show if not already submitted
      if (localStorage.getItem('elura_lead_submitted') !== 'true') {
        setIsOpen(true);
      }
    };

    // Initial 5 seconds delay before showing the popup
    initialTimer = setTimeout(showPopup, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    
    // If they close without submitting, show it again after 5 minutes (300,000 ms)
    if (!isSubmitted) {
      setTimeout(() => {
        if (localStorage.getItem('elura_lead_submitted') !== 'true') {
          setIsOpen(true);
        }
      }, 300000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const form = e.target;
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    try {
      const response = await fetch("https://formsubmit.co/ajax/info@simplemen.co.in", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Mark as submitted
        setIsSubmitted(true);
        localStorage.setItem('elura_lead_submitted', 'true');
        
        // Auto-close the popup after 4 seconds of showing the success animation
        setTimeout(() => {
          setIsOpen(false);
        }, 4000);
      } else {
        throw new Error("Failed to submit details. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting lead form:", error);
      setSubmitError("There was a problem sending your details. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="lead-popup__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div 
            className="lead-popup__content"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the overlay
          >
            <button className="lead-popup__close" onClick={handleClose}>
              <HiX size={24} />
            </button>
            
            {!isSubmitted ? (
              <div className="lead-popup__form-container">
                <h3 className="lead-popup__title">Start your journey with Elaura Academy</h3>
                <p className="lead-popup__subtitle">Please fill the form and our team will guide you.</p>
                
                <form onSubmit={handleSubmit} className="lead-popup__form">
                  {/* Hidden fields for FormSubmit configuration */}
                  <input type="hidden" name="_subject" value="New Elaura Academy Lead Submission" />
                  <input type="hidden" name="_honeypot" style={{ display: 'none' }} />
                  
                  {submitError && (
                    <div className="lead-popup__error" style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid #fca5a5', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {submitError}
                    </div>
                  )}

                  <div className="form-group-row">
                    <input type="text" name="Name" placeholder="Name" required />
                    <input type="tel" name="Phone" placeholder="Phone" required />
                  </div>
                  <div className="form-group-row">
                    <input type="email" name="Email" placeholder="Email" required />
                    <input type="number" name="Age" placeholder="Age" required min="10" max="99" />
                  </div>
                  <div className="form-group">
                    <input type="text" name="Interested Area" placeholder="Interested Area (e.g., Web Dev, Data Science)" required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="Address" placeholder="Address" required />
                  </div>
                  <div className="form-group">
                    <textarea name="Message" placeholder="Message" rows="3" required></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="lead-popup__submit" 
                    disabled={isSubmitting}
                    style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  >
                    {isSubmitting ? 'Sending Details...' : 'Submit Details'}
                  </button>
                </form>
              </div>
            ) : (
              <motion.div 
                className="lead-popup__success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <div className="success-checkmark">
                  <motion.svg viewBox="0 0 52 52" className="checkmark-svg">
                    <motion.circle 
                      cx="26" cy="26" r="25" fill="none" className="checkmark-circle"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                    />
                    <motion.path 
                      fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
                    />
                  </motion.svg>
                </div>
                <h3 className="success-title">Thank You!</h3>
                <p className="success-text">We have received your details. Our team will contact you shortly to guide you on your journey.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadPopup;
