import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaAndroid, FaChartLine, FaShieldAlt, FaPaintBrush } from 'react-icons/fa';
import { FiShare2, FiBookmark } from 'react-icons/fi';
import './CourseSection.css';

import imgCourse1 from '../../assets/course_1.jpg';
import imgCourse2 from '../../assets/course_2.jpg';
import imgCourse3 from '../../assets/course_3.jpg';
import imgCourse4 from '../../assets/course_4.jpg';
import imgCourse5 from '../../assets/course_5.jpg';
import imgCourse6 from '../../assets/course_6.jpg';

const baseCourses = [
  {
    id: 1,
    title: 'Certification Courses',
    image: imgCourse1,
    icon: <FaCode />,
    description: 'Enroll now and take the first step towards a brighter tomorrow with our short-term certification.',
    coursesCount: '3 Months',
    lessonsCount: 'English',
    duration: 'Govt. Approved'
  },
  {
    id: 2,
    title: 'Diploma Courses',
    image: imgCourse2,
    icon: <FaServer />,
    description: 'Comprehensive 8-month diploma programs designed to build strong foundational industry skills.',
    coursesCount: '8 Months',
    lessonsCount: 'English',
    duration: 'Govt. Approved'
  },
  {
    id: 3,
    title: 'Advanced Diploma',
    image: imgCourse3,
    icon: <FaAndroid />,
    description: 'Advanced curriculum for professionals aiming to specialize and excel in their chosen fields.',
    coursesCount: '10 Months',
    lessonsCount: 'English',
    duration: 'Govt. Approved'
  },
  {
    id: 4,
    title: 'PG Diploma',
    image: imgCourse4,
    icon: <FaChartLine />,
    description: 'Post-graduate level diploma tracks focusing on high-level expertise and practical application.',
    coursesCount: '12 Months',
    lessonsCount: 'English',
    duration: 'Govt. Approved'
  },
  {
    id: 5,
    title: 'Professional Track',
    image: imgCourse5,
    icon: <FaShieldAlt />,
    description: 'Intense, industry-focused training tracks to prepare you for modern corporate environments.',
    coursesCount: '6 Months',
    lessonsCount: 'English',
    duration: 'Govt. Approved'
  },
  {
    id: 6,
    title: 'Expert Degree Prep',
    image: imgCourse6,
    icon: <FaPaintBrush />,
    description: 'Rigorous preparation courses designed for ambitious students seeking elite higher education.',
    coursesCount: '12 Months',
    lessonsCount: 'English',
    duration: 'Govt. Approved'
  }
];

// Duplicate for seamless infinite scrolling
const courses = [...baseCourses, ...baseCourses];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const CourseSection = () => {
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
              <div key={`${course.id}-${index}`} className="course-card">
                
                {/* Image Header */}
                <div className="course-card__image-container">
                  <img src={course.image} alt={course.title} className="course-card__image" />
                </div>

                {/* Card Content */}
                <div className="course-card__content">
                  <div className="course-card__top">
                    <div className="course-card__title-wrap">
                      <div className="course-card__icon-box">
                        {course.icon}
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

              </div>
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
