import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiBookOpen, FiAward, FiCheckCircle, FiChevronRight, FiPlayCircle, FiMonitor } from 'react-icons/fi';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const [activeModule, setActiveModule] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const toggleModule = (modId) => {
    setActiveModule(activeModule === modId ? null : modId);
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourse = async () => {
      try {
        const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_courses.php' : '/backend/get_courses.php';
        const res = await fetch(url);
        const data = await res.json();
        const found = data.find(c => String(c.id) === String(id));
        
        // Ensure whatYouLearn and curriculum are arrays if they are strings
        if (found) {
          if (typeof found.whatYouLearn === 'string') {
            try { found.whatYouLearn = JSON.parse(found.whatYouLearn); } catch(e){}
          }
          if (typeof found.curriculum === 'string') {
            try { found.curriculum = JSON.parse(found.curriculum); } catch(e){}
          }
        }
        setCourse(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading Course...</div>;
  if (!course) return <div style={{padding: '100px', textAlign: 'center'}}>Course Not Found</div>;

  return (
    <div className="course-detail-page">
      {/* Course Hero Banner */}
      <section className="course-detail-hero">
        <div className="course-detail-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <FiChevronRight /> <Link to="/courses">Courses</Link> <FiChevronRight /> <span>{course.title}</span>
          </div>
          <span className="course-badge">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-meta">
            <span><FiClock /> {course.coursesCount}</span>
            <span><FiBookOpen /> {course.lessonsCount}</span>
            <span><FiAward /> {course.duration}</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="course-detail-body">
        <div className="course-detail-container">
          
          <div className="course-main-content">
            <motion.div 
              className="content-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2>About This Course</h2>
              <p>
                {course.overview || `This comprehensive program is designed to take you from a beginner to an advanced level in ${course.title}. You will gain practical, hands-on experience through real-world projects and industry-standard training.`}
              </p>
              {!course.overview && (
                <p>
                  Our curriculum is constantly updated to reflect the latest trends and demands of the modern workplace, ensuring you graduate with highly marketable and relevant skills.
                </p>
              )}
            </motion.div>

            <motion.div 
              className="content-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2>What You Will Learn</h2>
              <ul className="learning-list">
                {(course.whatYouLearn || []).map((item, idx) => (
                  <li key={idx}><FiCheckCircle /> {item}</li>
                ))}
                {(!course.whatYouLearn) && (
                  <>
                    <li><FiCheckCircle /> Master the foundational concepts and advanced techniques.</li>
                    <li><FiCheckCircle /> Build real-world projects to showcase in your portfolio.</li>
                    <li><FiCheckCircle /> Prepare for professional certifications and job interviews.</li>
                  </>
                )}
              </ul>
            </motion.div>

            <motion.div 
              className="content-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2>Course Curriculum</h2>
              <div className="curriculum-list">
                {(course.curriculum || []).map((mod) => (
                  <div key={mod.id} className={`curriculum-item ${activeModule === mod.id ? 'active' : ''}`}>
                    <div className="curriculum-header-row" onClick={() => toggleModule(mod.id)}>
                      <div className="curriculum-header">
                        <FiPlayCircle className="play-icon" /> 
                        <span>{mod.title}</span>
                      </div>
                      <span className="curriculum-duration">{mod.duration}</span>
                    </div>
                    
                    <AnimatePresence>
                      {activeModule === mod.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="curriculum-body"
                        >
                          <p>{mod.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <div className="course-sidebar">
            <motion.div 
              className="sticky-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="sticky-card-image">
                <img src={course.image} alt={course.title} />
              </div>
              <div className="sticky-card-content">
                <div className="price-tag">Admissions Open</div>
                <button 
                  className="enroll-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('openLeadPopup'));
                  }}
                >
                  Apply Now
                </button>
                <button className="download-btn">Download Syllabus</button>
                
                <div className="course-features">
                  <h3>This course includes:</h3>
                  <ul>
                    <li><FiMonitor /> {course.coursesCount} of intensive training</li>
                    <li><FiBookOpen /> Comprehensive study materials</li>
                    <li><FiAward /> {course.duration} Certificate</li>
                    <li><FiCheckCircle /> 100% Placement Assistance</li>
                    <li><FiCheckCircle /> Direct interaction with experts</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
