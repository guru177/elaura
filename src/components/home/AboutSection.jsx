import React, { useEffect, useRef } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { motion, useInView, animate } from 'framer-motion';
import './AboutSection.css';

import aboutImg1 from '../../assets/about_1_color.jpg';
import aboutImg2 from '../../assets/about_2_color.jpg';
import aboutImg3 from '../../assets/about_3_color.png';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Counter = ({ from, to, duration, suffix = '' }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: duration,
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.round(value) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView, suffix]);

  return <h3 ref={nodeRef}>{from}{suffix}</h3>;
};

const AboutSection = () => {
  return (
    <section className="about">
      <div className="about__container">
        
        {/* Header */}
        <motion.div 
          className="about__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="about__tag">
            <span className="about__tag-icon">
              <span className="about__tag-circle"></span>
              <span className="about__tag-half"></span>
            </span>
            <span className="about__tag-text">About Elaura</span>
          </div>
          <h2 className="about__title">
            Empowering Your Success<br/>with Educational Expertise
          </h2>
        </motion.div>

        {/* 6-6 Main Layout */}
        <div className="about__main">
          
          {/* Left Column - Images */}
          <motion.div 
            className="about__left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="about__images">
              <img src={aboutImg1} alt="Students collaborating at Elaura" className="about__img about__img--top" />
              <img src={aboutImg2} alt="Elaura instructors mentoring" className="about__img about__img--bottom" />
              <img src={aboutImg3} alt="Elaura student studying" className="about__img about__img--square" />

              {/* Hire Us Stamp */}
              <div className="about__stamp">
                <svg viewBox="0 0 100 100" className="about__stamp-svg">
                  <path id="curve" d="M 50 50 m -35 0 a 35 35 0 1 1 70 0 a 35 35 0 1 1 -70 0" fill="transparent" />
                  <text className="about__stamp-text">
                    <textPath href="#curve">EXPLORE • LEARN • EXCEL • </textPath>
                  </text>
                </svg>
                <div className="about__stamp-center">
                  <HiArrowRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text & Progress bars */}
          <motion.div 
            className="about__right"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.p className="about__description" variants={fadeUp}>
              At Elaura Academy, we believe in bridging the gap between potential and achievement. Our comprehensive educational programs are designed by industry leaders to foster innovation, cultivate leadership, and equip you with the practical skills needed to thrive in tomorrow's dynamic professional landscape.
            </motion.p>

            <motion.div className="about__skills" variants={staggerContainer}>
              <motion.div className="about__skill" variants={fadeUp}>
                <div className="about__skill-info">
                  <span className="about__skill-name">Academic Excellence</span>
                  <span className="about__skill-value">85%</span>
                </div>
                <div className="about__skill-bar">
                  <motion.div 
                    className="about__skill-progress" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                  >
                    <div className="about__skill-dot"></div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div className="about__skill" variants={fadeUp}>
                <div className="about__skill-info">
                  <span className="about__skill-name">Creativity & Innovation</span>
                  <span className="about__skill-value">80%</span>
                </div>
                <div className="about__skill-bar">
                  <motion.div 
                    className="about__skill-progress" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '80%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                  >
                    <div className="about__skill-dot"></div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div className="about__skill" variants={fadeUp}>
                <div className="about__skill-info">
                  <span className="about__skill-name">Leadership & Management</span>
                  <span className="about__skill-value">95%</span>
                </div>
                <div className="about__skill-bar">
                  <motion.div 
                    className="about__skill-progress" 
                    initial={{ width: 0 }}
                    whileInView={{ width: '95%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
                  >
                    <div className="about__skill-dot"></div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            <motion.button className="about__btn" variants={fadeUp}>
              Discover More <HiArrowRight style={{ marginLeft: '8px' }} />
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom Stats Row */}
        <motion.div 
          className="about__stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerContainer}
        >
          <motion.div className="about__stat" variants={fadeUp}>
            <div className="about__stat-header">
              <Counter from={0} to={3} duration={2.5} suffix="k+" />
              <span className="about__stat-icon">
                <span className="about__stat-circle"></span>
                <span className="about__stat-half"></span>
              </span>
            </div>
            <p>Successful Students</p>
          </motion.div>
          <motion.div className="about__stat" variants={fadeUp}>
            <div className="about__stat-header">
              <Counter from={0} to={200} duration={2.5} suffix="+" />
              <span className="about__stat-icon">
                <span className="about__stat-circle"></span>
                <span className="about__stat-half"></span>
              </span>
            </div>
            <p>Expert Instructors</p>
          </motion.div>
          <motion.div className="about__stat" variants={fadeUp}>
            <div className="about__stat-header">
              <Counter from={0} to={350} duration={2.5} suffix="+" />
              <span className="about__stat-icon">
                <span className="about__stat-circle"></span>
                <span className="about__stat-half"></span>
              </span>
            </div>
            <p>Global Partners</p>
          </motion.div>
          <motion.div className="about__stat about__stat--last" variants={fadeUp}>
            <div className="about__stat-header">
              <Counter from={0} to={16} duration={2.5} suffix="+" />
            </div>
            <p>Years of Experience</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;
