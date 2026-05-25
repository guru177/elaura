import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FiTarget, FiEye, FiCheckCircle, FiChevronDown, FiBookOpen, FiUsers, FiAward, FiGlobe } from 'react-icons/fi';
import './Contact.css'; // For the page-hero
import './About.css';

const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      let startTime = null;
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        // Easing function: easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const About = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [trainers, setTrainers] = useState([]);
  
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const url = window.location.hostname === 'localhost' 
          ? 'http://localhost:8000/manage_trainers.php' 
          : '/backend/manage_trainers.php';
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTrainers(data);
        }
      } catch (err) {
        console.error('Failed to fetch trainers:', err);
      }
    };
    fetchTrainers();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    { question: 'What is the teaching methodology at Elaura Academy?', answer: 'We follow a hands-on, project-based approach. Our methodology emphasizes practical application of theories, ensuring students are job-ready from day one.' },
    { question: 'Are the courses recognized globally?', answer: 'Yes, our certification and diploma programs are developed in alignment with international industry standards, making them highly recognized globally.' },
    { question: 'Who are the trainers?', answer: 'Our trainers are industry veterans with years of real-world experience. They bring practical insights and corporate knowledge directly into the classroom.' },
    { question: 'Do you offer placement assistance?', answer: 'Absolutely! We have a dedicated placement cell that helps connect our successful graduates with top companies in the industry.' },
    { question: 'Can I access the course materials after completion?', answer: 'Yes, all our graduates receive lifetime access to the core course materials, including updates to the curriculum as industry standards evolve.' },
    { question: 'Are there any prerequisites for enrolling?', answer: 'While some advanced courses require basic foundational knowledge, most of our certification programs are designed to take you from a beginner to a professional level.' },
    { question: 'Is the training completely online or offline?', answer: 'We offer a hybrid learning model. You can choose to attend in-person classes at our campus or join live interactive sessions online from anywhere in the world.' },
    { question: 'How do I apply for a course?', answer: 'Simply navigate to our Courses page, select your desired program, and click "Apply Now". Our admissions team will get in touch with you shortly.' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="page-hero">
        <motion.div 
          className="page-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>About <span>Elaura</span></h1>
          <p>We are a premier educational institution committed to transforming careers through industry-aligned, practical training.</p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="about-section with-double-border">
        <div className="about-container story-grid">
          <motion.div 
            className="story-content"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-subtitle">OUR JOURNEY</div>
            <h2>The Story Behind Elaura Academy</h2>
            <p>
              Elaura Academy was founded with a singular vision: to bridge the gap between traditional education and the rapidly evolving demands of the modern workforce. We realized that many talented individuals lacked the practical, hands-on skills required to succeed in competitive corporate environments.
            </p>
            <p>
              Since our inception, we have trained thousands of students, empowering them with the tools, knowledge, and confidence to build successful careers. Our commitment to excellence remains unwavering as we continue to innovate our curriculum.
            </p>
            <div className="story-stats">
              <div className="stat-box">
                <div className="stat-number">
                  <AnimatedCounter value="10" suffix="k+" />
                </div>
                <div className="stat-label">Students Trained</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">
                  <AnimatedCounter value="50" suffix="+" />
                </div>
                <div className="stat-label">Expert Trainers</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">
                  <AnimatedCounter value="95" suffix="%" />
                </div>
                <div className="stat-label">Placement Rate</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">
                  <AnimatedCounter value="15" suffix="+" />
                </div>
                <div className="stat-label">Global Partners</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="story-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="/contact-hero-bg.png" alt="Elaura Academy Students" />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-section with-double-border">
        <div className="about-container mission-grid">
          <motion.div 
            className="mission-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mission-icon"><FiTarget /></div>
            <h3>Our Mission</h3>
            <p>To provide accessible, high-quality, and practical education that equips individuals with the skills necessary to excel in the global workforce. We strive to foster an environment of continuous learning and innovation.</p>
          </motion.div>
          <motion.div 
            className="mission-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
          >
            <div className="mission-icon"><FiEye /></div>
            <h3>Our Vision</h3>
            <p>To be the globally recognized leader in professional education and skill development, empowering the next generation of industry leaders, innovators, and creators to shape a better future.</p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-section bg-dark with-double-border">
        <motion.div 
          className="about-container text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="section-subtitle light">DIFFERENTIATORS</div>
          <h2 className="text-white">Why Choose Elaura Academy</h2>
          <motion.div 
            className="why-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div className="why-card" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
              <FiBookOpen className="why-icon" />
              <h4>Industry-Aligned Curriculum</h4>
              <p>Our syllabus is designed directly by industry experts to meet current market demands.</p>
            </motion.div>
            <motion.div className="why-card" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
              <FiUsers className="why-icon" />
              <h4>Expert Faculty</h4>
              <p>Learn from seasoned professionals who bring real-world corporate experience to the classroom.</p>
            </motion.div>
            <motion.div className="why-card" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
              <FiAward className="why-icon" />
              <h4>Global Certifications</h4>
              <p>Earn certificates that are recognized and valued by top employers worldwide.</p>
            </motion.div>
            <motion.div className="why-card" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
              <FiGlobe className="why-icon" />
              <h4>100% Placement Support</h4>
              <p>Dedicated career services to help you land your dream job immediately after graduation.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Learning Methodology */}
      <section className="about-section with-double-border">
        <div className="about-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="section-subtitle">OUR APPROACH</div>
            <h2>Learning Methodology</h2>
            <p className="header-desc">We believe in learning by doing. Our methodology ensures that theoretical knowledge is always backed by practical implementation.</p>
          </motion.div>
          
          <motion.div 
            className="methodology-timeline"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">01</div>
              <h4>Core Theory</h4>
              <p>Mastering the fundamental concepts and principles of the subject matter.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">02</div>
              <h4>Hands-on Practice</h4>
              <p>Applying concepts through lab sessions and interactive assignments.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">03</div>
              <h4>Live Projects</h4>
              <p>Working on real-world case studies to build a strong portfolio.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">04</div>
              <h4>Career Prep</h4>
              <p>Mock interviews, resume building, and industry networking.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">05</div>
              <h4>Mentorship</h4>
              <p>One-on-one guidance from industry veterans to navigate complex challenges.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">06</div>
              <h4>Assessment</h4>
              <p>Continuous evaluation through quizzes and feedback sessions to track progress.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">07</div>
              <h4>Certification</h4>
              <p>Earning globally recognized credentials upon successful program completion.</p>
            </motion.div>
            <motion.div className="methodology-step" variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <div className="step-number">08</div>
              <h4>Alumni Network</h4>
              <p>Lifetime access to our exclusive community of professionals and job boards.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Meet Our Trainers */}
      {trainers.length > 0 && (
        <section className="about-section with-double-border">
          <div className="about-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="section-subtitle">OUR EXPERTS</div>
              <h2>Meet Our Trainers</h2>
              <p className="header-desc">Learn from the best in the industry. Our faculty members are passionate educators and seasoned professionals.</p>
            </motion.div>

              <div className="trainers-grid">
                {trainers.map((trainer, index) => (
                  <motion.div 
                    key={trainer.id} 
                    className="trainer-card" 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="trainer-image">
                      {trainer.image && (
                        <img src={trainer.image} alt={trainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div className="trainer-info">
                      <h4>{trainer.name}</h4>
                      <span className="trainer-role">{trainer.role}</span>
                      <p>{trainer.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="about-section">
        <div className="about-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="section-subtitle">HAVE QUESTIONS?</div>
            <h2>Frequently Asked Questions</h2>
          </motion.div>

          <motion.div 
            className="faq-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div className="faq-header" onClick={() => toggleFaq(index)}>
                  <h4>{faq.question}</h4>
                  <FiChevronDown className="faq-icon" />
                </div>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="faq-body"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
