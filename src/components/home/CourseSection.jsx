import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaAndroid, FaChartLine, FaShieldAlt, FaPaintBrush } from 'react-icons/fa';
import { FiShare2, FiBookmark, FiBookOpen } from 'react-icons/fi';
import './CourseSection.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const CourseSection = () => {
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_courses.php' : '/backend/get_courses.php';
        const res = await fetch(url);
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        const top6 = validData.reverse().slice(0, 6); // Take the 6 most recent courses
        setCourses([...top6, ...top6]); // duplicate for infinite scrolling
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);
  return (
    <section className="courses">
      <div className="courses__container">
        
        {/* Header */}
        <motion.div 
          className="courses__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
        >
          <h2 className="courses__title">Our Programs</h2>
          <p className="courses__subtitle">
            Empower your future with our meticulously designed educational tracks, tailored for excellence.
          </p>
        </motion.div>

        {/* Cards Slider */}
        <motion.div 
          className="courses__slider-wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className="courses__slider">
            {courses.map((course, index) => (
              <Link to={`/courses/${course.id}`} key={`${course.id}-${index}`} className="course-card" style={{ textDecoration: 'none' }}>
                
                {/* Image Header */}
                <div className="course-card__image-container">
                  <img src={course.image} alt={course.title} className="course-card__image" />
                </div>

                {/* Card Content */}
                <div className="course-card__content">
                  <div className="course-card__top">
                    <div className="course-card__title-wrap">
                      <div className="course-card__icon-box">
                        <FiBookOpen />
                      </div>
                      <h3 className="course-card__title">{course.title}</h3>
                    </div>
                    <div className="course-card__actions">
                      <FiShare2 className="course-card__action-icon" />
                      <FiBookmark className="course-card__action-icon" />
                    </div>
                  </div>

                  <p className="course-card__desc">
                    {course.description}
                  </p>

                  {/* Footer Stats */}
                  <div className="course-card__footer">
                    <span>{course.coursesCount}</span>
                    <span>{course.lessonsCount}</span>
                    <span>{course.duration}</span>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="courses__view-all"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeUp}
        >
          <button className="courses__view-btn">View All Programs</button>
        </motion.div>

      </div>
    </section>
  );
};

export default CourseSection;
