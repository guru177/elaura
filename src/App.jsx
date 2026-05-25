import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingContact from './components/layout/FloatingContact';
import LeadPopup from './components/common/LeadPopup';
import SEOManager from './components/common/SEOManager';
import Home    from './pages/Home';
import About   from './pages/About';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import CourseDetail from './pages/CourseDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import './styles/global.css';

const pageVariants = {
  initial:   { opacity: 0, y: 16 },
  animate:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:      { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Hide Navbar, Footer, etc on Admin pages
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <SEOManager />
      {!isAdminRoute && <Navbar />}
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={!isAdminRoute ? pageVariants : {}}
            initial="initial"
            animate="animate"
            exit="exit"
            style={isAdminRoute ? { height: '100vh' } : {}}
          >
            <Routes location={location}>
              <Route path="/"        element={<Home />} />
              <Route path="/about"   element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAdminRoute && <FloatingContact />}
      {!isAdminRoute && <LeadPopup />}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AnimatedRoutes />
  </Router>
);

export default App;
