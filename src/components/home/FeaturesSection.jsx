import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaHandshake, FaDesktop } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import './FeaturesSection.css';

import feat1 from '../../assets/feature_1.jpg';
import feat2 from '../../assets/feature_2.jpg';
import feat3 from '../../assets/feature_3.jpg';
import feat4 from '../../assets/feature_4.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const FeaturesSection = () => {
  return (
    <section className="features">
      <div className="features__container">
        
        {/* Left: Diamond Collage */}
        <motion.div 
          className="features__collage-wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <div className="features__collage">
            <motion.div className="features__collage-item" variants={{
              hidden: { opacity: 0, scale: 0.5, rotate: -15 },
              visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
            }}>
              <img src={feat1} alt="Students in computer lab" className="features__collage-img" />
            </motion.div>
            
            <motion.div className="features__collage-item" variants={{
              hidden: { opacity: 0, scale: 0.5, rotate: 15 },
              visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
            }}>
              <img src={feat2} alt="Professional networking" className="features__collage-img" />
            </motion.div>
            
            <motion.div className="features__collage-item" variants={{
              hidden: { opacity: 0, scale: 0.5, rotate: -15 },
              visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
            }}>
              <img src={feat3} alt="Student studying" className="features__collage-img" />
            </motion.div>
            
            <motion.div className="features__collage-item" variants={{
              hidden: { opacity: 0, scale: 0.5, rotate: 15 },
              visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
            }}>
              <img src={feat4} alt="Academy building" className="features__collage-img" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div 
          className="features__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 className="features__title" variants={fadeUp}>
            The Elura Academy <span className="features__title-highlight">Advantage</span>
          </motion.h2>

          <div className="features__list">
            
            {/* Feature 1 */}
            <motion.div className="feature-item" variants={fadeUp}>
              <div className="feature-item__icon-box">
                <FaLaptopCode className="feature-item__icon" />
              </div>
              <div className="feature-item__text">
                <h3 className="feature-item__title">01. Industry-Validated Curriculum</h3>
                <p className="feature-item__desc">
                  At Elura Academy, our meticulously structured Diploma and PG programs are designed to meet strict government and industry standards, ensuring your qualifications hold true global value.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div className="feature-item" variants={fadeUp}>
              <div className="feature-item__icon-box">
                <FaHandshake className="feature-item__icon" />
              </div>
              <div className="feature-item__text">
                <h3 className="feature-item__title">02. Elite Corporate Placements</h3>
                <p className="feature-item__desc">
                  We bridge the gap between academia and the corporate world. Elura students gain exclusive access to top-tier placement drives, expert seminars, and powerful professional networks.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div className="feature-item" variants={fadeUp}>
              <div className="feature-item__icon-box">
                <FaDesktop className="feature-item__icon" />
              </div>
              <div className="feature-item__text">
                <h3 className="feature-item__title">03. State-of-the-Art Hybrid Campus</h3>
                <p className="feature-item__desc">
                  Experience the best of both worlds with our premium physical infrastructure and an advanced digital LMS. Access our intensive 12-month curriculums flexibly from anywhere.
                </p>
              </div>
            </motion.div>

          </div>

          <motion.button className="features__btn" variants={fadeUp}>
            Contact Now <FiArrowRight className="features__btn-icon" />
          </motion.button>

        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
