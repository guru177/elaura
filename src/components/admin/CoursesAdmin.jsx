import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiShare2, FiBookmark } from 'react-icons/fi';
import '../home/CourseSection.css';
import './CoursesAdmin.css';

const CoursesAdmin = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    id: '', title: '', image: '', description: '', coursesCount: '', 
    lessonsCount: '', duration: '', category: '', overview: '', 
    whatYouLearn: [''], curriculum: [{ title: '', duration: '', description: '' }]
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_courses.php' : '/backend/get_courses.php';
      const response = await fetch(url);
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/manage_categories.php' : '/backend/manage_categories.php';
      const response = await fetch(url);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const manageCategory = async (action, id = null, name = '') => {
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/manage_categories.php' : '/backend/manage_categories.php';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action, id, name })
      });
      const data = await response.text();
      if (!response.ok) {
        alert("Server error: " + response.status + " " + data);
        return;
      }
      
      fetchCategories();
      if (action === 'add') setNewCategoryName('');
      if (action === 'edit') setEditingCategoryId(null);
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      ...course,
      whatYouLearn: Array.isArray(course.whatYouLearn) && course.whatYouLearn.length ? course.whatYouLearn : [''],
      curriculum: Array.isArray(course.curriculum) && course.curriculum.length ? course.curriculum : [{ title: '', duration: '', description: '' }]
    });
    setImageFile(null);
    setPreviewImage(course.image || null);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/delete_course.php' : '/backend/delete_course.php';
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id })
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/save_course.php' : '/backend/save_course.php';
      
      let fetchOptions = {};
      if (imageFile) {
        const fd = new FormData();
        Object.keys(formData).forEach(key => {
          if (typeof formData[key] === 'object') {
            fd.append(key, JSON.stringify(formData[key]));
          } else {
            fd.append(key, formData[key]);
          }
        });
        fd.append('imageFile', imageFile);
        fetchOptions = {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        };
      } else {
        fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        };
      }

      await fetch(url, fetchOptions);
      setIsEditing(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const addLearnItem = () => setFormData({ ...formData, whatYouLearn: [...formData.whatYouLearn, ''] });
  const updateLearnItem = (index, value) => {
    const newArr = [...formData.whatYouLearn];
    newArr[index] = value;
    setFormData({ ...formData, whatYouLearn: newArr });
  };
  const removeLearnItem = (index) => {
    const newArr = [...formData.whatYouLearn];
    newArr.splice(index, 1);
    setFormData({ ...formData, whatYouLearn: newArr });
  };

  const addModule = () => setFormData({ ...formData, curriculum: [...formData.curriculum, { title: '', duration: '', description: '' }] });
  const updateModule = (index, field, value) => {
    const newArr = [...formData.curriculum];
    newArr[index][field] = value;
    setFormData({ ...formData, curriculum: newArr });
  };
  const removeModule = (index) => {
    const newArr = [...formData.curriculum];
    newArr.splice(index, 1);
    setFormData({ ...formData, curriculum: newArr });
  };

  if (isEditing) {
    return (
      <div className="courses-admin-edit-wrapper" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Form */}
        <div className="courses-admin-form" style={{ flex: '1', minWidth: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: 0, paddingBottom: 0, borderBottom: 'none' }}>{formData.id ? 'Edit Course' : 'Add New Course'}</h2>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#475569' }}
            >
              &larr; Back to List
            </button>
          </div>
          
          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category (Top Badge)</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }} 
                />
              </div>
              <div className="form-group">
                <label>Duration/Left Stat (e.g. 6 Months)</label>
                <input type="text" value={formData.coursesCount} onChange={e => setFormData({...formData, coursesCount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Language/Center Stat (e.g. English)</label>
                <input type="text" value={formData.lessonsCount} onChange={e => setFormData({...formData, lessonsCount: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Right Stat (e.g. Govt. Approved)</label>
                <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Short Description (Frontend Card)</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" />
            </div>
            
            <div className="form-group full-width">
              <label>Detailed Overview (Detail Page)</label>
              <textarea value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} rows="4" />
            </div>

            <div className="dynamic-list-section">
              <h3>What You Will Learn</h3>
              {formData.whatYouLearn.map((item, idx) => (
                <div key={idx} className="dynamic-list-item">
                  <input type="text" value={item} onChange={e => updateLearnItem(idx, e.target.value)} placeholder="E.g. Master frontend development" />
                  <button type="button" className="btn-remove" onClick={() => removeLearnItem(idx)}>X</button>
                </div>
              ))}
              <button type="button" className="btn-add-small" onClick={addLearnItem}>+ Add Skill</button>
            </div>

            <div className="dynamic-list-section">
              <h3>Curriculum Modules</h3>
              {formData.curriculum.map((mod, idx) => (
                <div key={idx} className="module-item">
                  <div className="module-header">
                    <strong>Module {idx + 1}</strong>
                    <button type="button" className="btn-remove" onClick={() => removeModule(idx)}>X</button>
                  </div>
                  <input type="text" placeholder="Title (e.g. Phase 1: Basics)" value={mod.title} onChange={e => updateModule(idx, 'title', e.target.value)} />
                  <input type="text" placeholder="Duration (e.g. 2 Weeks)" value={mod.duration} onChange={e => updateModule(idx, 'duration', e.target.value)} />
                  <textarea placeholder="Description" rows="2" value={mod.description} onChange={e => updateModule(idx, 'description', e.target.value)} />
                </div>
              ))}
              <button type="button" className="btn-add-small" onClick={addModule}>+ Add Module</button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" style={{ width: '100%' }}>Save Course Database</button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div style={{ flex: '1', position: 'sticky', top: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#64748b' }}>Live Frontend Preview</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>This is exactly how the card will look on the public website.</p>
          </div>
          
          <div className="course-card" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            <div className="course-card__image-container">
              {(previewImage || formData.image) ? (
                <img src={previewImage || formData.image} alt="Preview" className="course-card__image" />
              ) : (
                <div className="course-card__image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#334155', color: '#cbd5e1', fontSize: '14px', fontWeight: '600' }}>
                  Please Upload Image
                </div>
              )}
            </div>

            <div className="course-card__content">
              <div className="course-card__top">
                <div className="course-card__title-wrap">
                  <div className="course-card__icon-box">
                    <FiBookOpen />
                  </div>
                  <h3 className="course-card__title">{formData.title || 'Course Title'}</h3>
                </div>
                <div className="course-card__actions">
                  <FiShare2 className="course-card__action-icon" />
                  <FiBookmark className="course-card__action-icon" />
                </div>
              </div>

              <p className="course-card__desc">
                {formData.description || 'Enter a short description to see it previewed here...'}
              </p>

              <div className="course-card__footer">
                <span>{formData.coursesCount || '6 Months'}</span>
                <span>{formData.lessonsCount || 'English'}</span>
                <span>{formData.duration || 'Govt. Approved'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="courses-admin">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Courses Management</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Total Courses: {courses.length}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-add" style={{ background: '#64748b' }} onClick={() => setShowCategoryPopup(true)}>
            + Manage Categories
          </button>
          <button className="btn-add" onClick={() => handleEdit({ id: '', title: '', image: '', description: '', coursesCount: '', lessonsCount: '', duration: '', category: '', overview: '', whatYouLearn: [''], curriculum: [{ title: '', duration: '', description: '' }] })}>
            + Add New Course
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="admin-loading">Loading courses...</div>
      ) : (
        <div className="admin-courses-grid-frontend" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', marginTop: '20px' }}>
          {courses.map(course => (
            <div key={course.id} className="admin-course-card-wrapper" style={{ display: 'flex', height: '100%' }}>
              <div className="course-card course-card-light" style={{ margin: 0, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Image Header */}
                <div className="course-card__image-container">
                  <img src={course.image} alt={course.title} className="course-card__image" />
                </div>

                {/* Card Content */}
                <div className="course-card__content" style={{ paddingBottom: '0', flex: 1 }}>
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
                    <span>{course.coursesCount || 'N/A'}</span>
                    <span>{course.lessonsCount || 'N/A'}</span>
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                </div>

                {/* Admin Action Buttons Inside Card */}
                <div style={{ display: 'flex', gap: '10px', padding: '1.5rem', paddingTop: '1rem', marginTop: 'auto' }}>
                  <button 
                    style={{ flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }} 
                    onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                    onClick={() => handleEdit(course)}
                  >
                    Edit Course
                  </button>
                  <button 
                    style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }} 
                    onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                    onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {showCategoryPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Manage Categories</h3>
              <button onClick={() => setShowCategoryPopup(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
              {categories.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>No categories found.</p>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #e2e8f0' }}>
                    {editingCategoryId === cat.id ? (
                      <input 
                        type="text" 
                        value={editingCategoryName} 
                        onChange={e => setEditingCategoryName(e.target.value)} 
                        style={{ flex: 1, marginRight: '10px', padding: '5px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: '500' }}>{cat.name}</span>
                    )}
                    
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {editingCategoryId === cat.id ? (
                        <>
                          <button onClick={() => manageCategory('edit', cat.id, editingCategoryName)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => setEditingCategoryId(null)} style={{ background: '#64748b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); }} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => { if(window.confirm('Delete this category?')) manageCategory('delete', cat.id); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <input 
                type="text" 
                placeholder="New Category Name" 
                value={newCategoryName} 
                onChange={e => setNewCategoryName(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <button 
                onClick={() => manageCategory('add', null, newCategoryName)}
                disabled={!newCategoryName.trim()}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesAdmin;
