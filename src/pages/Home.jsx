import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import MarqueeSection from '../components/home/MarqueeSection';
import CourseSection from '../components/home/CourseSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-wrapper"
    >
      <HeroSection />
      <AboutSection />
      <MarqueeSection />
      <CourseSection />
      <FeaturesSection />
      <TestimonialsSection />
    </motion.div>
  );
};

export default Home;
