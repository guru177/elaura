import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import './TestimonialsSection.css';

import img1 from '../../assets/testi_1.png';
import img2 from '../../assets/testi_2.png';
import img3 from '../../assets/testi_3.png';
import img4 from '../../assets/testi_4.png';
import img5 from '../../assets/testi_5.png';
import img6 from '../../assets/testi_6.png';
import img7 from '../../assets/testi_7.png';
import img8 from '../../assets/testi_8.png';
import img9 from '../../assets/testi_9.png';
import img10 from '../../assets/testi_10.png';
import img11 from '../../assets/testi_11.png';
import img12 from '../../assets/testi_12.png';
import img13 from '../../assets/testi_13.png';
import img14 from '../../assets/testi_14.png';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Senior Software Engineer',
    image: 'https://i.pravatar.cc/150?img=47',
    text: 'Elura Academy transformed my career trajectory. The hybrid learning experience and expert mentorship allowed me to master advanced architecture concepts seamlessly. Highly recommend to any ambitious professional!',
    stars: 5
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Product Manager',
    image: 'https://i.pravatar.cc/150?img=11',
    text: 'Our company needed a pipeline of highly skilled developers, and Elura Academy delivered. The candidates we hired from their placement drives were exceptionally well-prepared and immediately impactful.',
    stars: 5
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'UI/UX Lead',
    image: 'https://i.pravatar.cc/150?img=32',
    text: 'I love the variety of intensive tracks available! The curriculum is incredibly modern and aligned with exactly what top tech companies are looking for. The professional exposure is unmatched.',
    stars: 5
  },
  {
    id: 4,
    name: 'Michael Carter',
    role: 'Data Scientist',
    image: 'https://i.pravatar.cc/150?img=60',
    text: 'The PG Diploma program is rigorous and exceptionally structured. The hands-on projects helped me build a portfolio that directly landed me my dream role. Best investment in my future.',
    stars: 5
  },
  {
    id: 5,
    name: 'Aisha Patel',
    role: 'Frontend Developer',
    image: 'https://i.pravatar.cc/150?img=41',
    text: 'The environment here is unlike any other. The networking opportunities with industry leaders are genuinely top-tier. I made connections that were crucial for my career advancement.',
    stars: 5
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Tech Consultant',
    image: 'https://i.pravatar.cc/150?img=68',
    text: 'As an employer, Elura graduates consistently stand out during our interviews. They possess a perfect blend of theoretical knowledge and practical, modern coding skills.',
    stars: 5
  }
];

const galleryContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      
      {/* ── Top Gallery ── */}
      <div className="testimonials__gallery-wrapper">
        <motion.div 
          className="testimonials__gallery"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={galleryContainer}
        >
          <motion.div className="gal-col shift-down-1" variants={popIn}>
            <img src={img1} alt="Gallery" className="img-md" />
            <img src={img2} alt="Gallery" className="img-md" />
          </motion.div>
          <motion.div className="gal-col shift-up-1" variants={popIn}>
            <img src={img3} alt="Gallery" className="img-sm" />
            <img src={img4} alt="Gallery" className="img-sq" />
            <img src={img5} alt="Gallery" className="img-sm" />
          </motion.div>
          <motion.div className="gal-col shift-down-2" variants={popIn}>
            <img src={img6} alt="Gallery" className="img-tall-1" />
          </motion.div>
          <motion.div className="gal-col shift-up-2" variants={popIn}>
            <img src={img7} alt="Gallery" className="img-tall-2" />
          </motion.div>
          <motion.div className="gal-col shift-up-2" variants={popIn}>
            <img src={img8} alt="Gallery" className="img-tall-2" />
          </motion.div>
          <motion.div className="gal-col shift-down-2" variants={popIn}>
            <img src={img9} alt="Gallery" className="img-tall-1" />
          </motion.div>
          <motion.div className="gal-col shift-up-1" variants={popIn}>
            <img src={img10} alt="Gallery" className="img-sm" />
            <img src={img11} alt="Gallery" className="img-sq" />
            <img src={img12} alt="Gallery" className="img-sm" />
          </motion.div>
          <motion.div className="gal-col shift-down-4" variants={popIn}>
            <img src={img13} alt="Gallery" className="img-md" />
            <img src={img14} alt="Gallery" className="img-md" />
          </motion.div>
        </motion.div>
        <div className="testimonials__gallery-fade"></div>
      </div>

      {/* ── Content ── */}
      <div className="testimonials__container">
        
        {/* Header Overlay */}
        <motion.div 
          className="testimonials__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <span className="testimonials__badge">Testimonials</span>
          <h2 className="testimonials__title">
            Trusted by creatives and leaders <br />
            <span className="testimonials__title-grey">from various industries</span>
          </h2>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="testimonials__slider-wrapper">
          <div className="testimonials__slider">
            {[...testimonials, ...testimonials].map((testi, idx) => (
              <div key={`${testi.id}-${idx}`} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {[...Array(testi.stars)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{testi.text}"</p>
                
                <div className="testimonial-card__user">
                  <img src={testi.image} alt={testi.name} className="testimonial-card__avatar" />
                  <div className="testimonial-card__user-info">
                    <h4 className="testimonial-card__name">{testi.name}</h4>
                    <span className="testimonial-card__role">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
