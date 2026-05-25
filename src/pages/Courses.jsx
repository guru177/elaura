import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShare2, FiBookmark, FiSearch, FiChevronLeft, FiChevronRight, FiBookOpen } from 'react-icons/fi';
import './Contact.css'; // For the page-hero
import '../components/home/CourseSection.css'; // For the course-card styles
import './Courses.css'; // For the grid layout

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const gridSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_courses.php' : '/backend/get_courses.php';
        const catsUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000/manage_categories.php' : '/backend/manage_categories.php';
        
        const [coursesRes, catsRes] = await Promise.all([
          fetch(coursesUrl),
          fetch(catsUrl)
        ]);
        
        const coursesData = await coursesRes.json();
        const catsData = await catsRes.json();
        
        setAllCourses(Array.isArray(coursesData) ? coursesData.reverse() : []);
        const catNames = Array.isArray(catsData) ? catsData.map(c => c.name) : [];
        setCategories(['All', ...catNames]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (gridSectionRef.current) {
      // Scroll to just above the grid, offset by navbar height
      const y = gridSectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="page-hero">
        <motion.div 
          className="page-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Our <span>Courses</span></h1>
          <p>Explore our wide range of educational programs tailored to jumpstart your career and expand your horizons.</p>
        </motion.div>
      </section>

      {/* Courses Grid Section */}
      <section className="courses-grid-page" ref={gridSectionRef}>
        {/* Filters Section */}
        <div className="courses-filter-section">
          <div className="courses-count">
            <h2>All Courses ({filteredCourses.length})</h2>
          </div>
          
          <div className="courses-controls">
            {/* Category Select */}
            <select 
              className="course-category-select"
              value={selectedCategory} 
              onChange={handleCategoryChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Search */}
            <div className="course-search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="courses-grid-container">
          {paginatedCourses.map((course, index) => (
            <Link to={`/courses/${course.id}`} key={course.id} style={{ textDecoration: 'none' }}>
              <motion.div 
                className="course-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
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
            </motion.div>
          </Link>
          ))}
          
          {filteredCourses.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <h3>No courses found matching your criteria.</h3>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="courses-pagination">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1} 
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
