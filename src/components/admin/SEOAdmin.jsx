import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';
import './CoursesAdmin.css';

const SEOAdmin = ({ token }) => {
  const [seoRecords, setSeoRecords] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    page_path: '',
    title: '',
    description: '',
    keywords: '',
    canonical_url: '',
    og_image: ''
  });

  const url = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/manage_seo.php' 
    : '/backend/manage_seo.php';

  useEffect(() => {
    fetchSeoRecords();
  }, []);

  const fetchSeoRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSeoRecords(data);
      }
      
      // Also fetch courses for the dropdown
      const courseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/get_courses.php' 
        : '/backend/get_courses.php';
      const courseRes = await fetch(courseUrl);
      const courseData = await courseRes.json();
      if (Array.isArray(courseData)) {
        setAvailableCourses(courseData);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch SEO records or courses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record = null) => {
    setImageFile(null);
    if (record) {
      setFormData(record);
      setPreviewImage(record.og_image || '');
    } else {
      setFormData({
        id: null,
        page_path: '',
        title: '',
        description: '',
        keywords: '',
        canonical_url: '',
        og_image: ''
      });
      setPreviewImage('');
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Auto format path
    let path = formData.page_path.trim();
    if (!path.startsWith('/')) path = '/' + path;
    
    try {
      let fetchOptions = {};
      
      if (imageFile) {
        const fd = new FormData();
        fd.append('action', 'save');
        fd.append('id', formData.id);
        fd.append('page_path', path);
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('keywords', formData.keywords);
        fd.append('canonical_url', formData.canonical_url);
        fd.append('og_image', formData.og_image);
        fd.append('imageFile', imageFile);
        fetchOptions = {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        };
      } else {
        const payload = {
          action: 'save',
          ...formData,
          page_path: path
        };
        fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        };
      }
      
      const res = await fetch(url, fetchOptions);
      const result = await res.json();
      if (result.status === 'success') {
        fetchSeoRecords();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Failed to save SEO record');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this SEO record?')) return;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'delete', id })
      });
      const result = await res.json();
      if (result.status === 'success') {
        fetchSeoRecords();
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting SEO record');
    }
  };

  return (
    <div className="admin-courses-wrapper">
      <div className="admin-courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0 }}>SEO Management</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add SEO Record
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading SEO records...</div>
      ) : (
        <div className="admin-table-container" style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <table className="admin-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 10px' }}>Page Path</th>
                <th style={{ padding: '12px 10px' }}>Title</th>
                <th style={{ padding: '12px 10px' }}>Description</th>
                <th style={{ padding: '12px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {seoRecords.map(record => (
                <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px 10px', fontWeight: '600' }}>{record.page_path}</td>
                  <td style={{ padding: '15px 10px' }}>{record.title}</td>
                  <td style={{ padding: '15px 10px' }}>
                    {record.description ? (record.description.length > 50 ? record.description.substring(0, 50) + '...' : record.description) : '-'}
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-view" style={{ padding: '5px 12px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }} onClick={() => handleOpenModal(record)}>
                        Edit
                      </button>
                      <button className="btn-delete" style={{ padding: '5px 12px', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }} onClick={() => handleDelete(record.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {seoRecords.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No SEO records found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="admin-modal-content"
              style={{ maxWidth: '650px', width: '90%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>{formData.id ? 'Edit SEO Metadata' : 'Add SEO Metadata'}</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              
              <form onSubmit={handleSave} className="admin-modal-body">
                <div className="form-group">
                  <label>Select Page *</label>
                  <select name="page_path" value={formData.page_path} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                    <option value="" disabled>Select a page to manage</option>
                    
                    <optgroup label="Core Pages">
                      {[
                        { value: '/', label: 'Home Page (/)' },
                        { value: '/about', label: 'About Us (/about)' },
                        { value: '/courses', label: 'Courses List (/courses)' },
                        { value: '/gallery', label: 'Gallery (/gallery)' },
                        { value: '/contact', label: 'Contact Us (/contact)' }
                      ].map(page => {
                        const exists = seoRecords.some(r => r.page_path === page.value);
                        const isEditing = formData.id && formData.page_path === page.value;
                        if (!exists || isEditing) {
                          return <option key={page.value} value={page.value}>{page.label}</option>;
                        }
                        return null;
                      })}
                    </optgroup>
                    
                    {availableCourses.length > 0 && (
                      <optgroup label="Course Detail Pages">
                        {availableCourses.map(course => {
                          const path = `/courses/${course.id}`;
                          const exists = seoRecords.some(r => r.page_path === path);
                          const isEditing = formData.id && formData.page_path === path;
                          if (!exists || isEditing) {
                            return (
                              <option key={course.id} value={path}>
                                {course.title} ({path})
                              </option>
                            );
                          }
                          return null;
                        })}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Meta Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                  <small style={{ color: '#64748b' }}>Ideal length: 50-60 characters</small>
                </div>

                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                  <small style={{ color: '#64748b' }}>Ideal length: 150-160 characters</small>
                </div>
                
                <div className="form-group">
                  <label>Meta Keywords</label>
                  <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="Comma separated keywords" />
                </div>
                
                <div className="form-group">
                  <label>Canonical URL</label>
                  <input type="text" name="canonical_url" value={formData.canonical_url} onChange={handleChange} placeholder="https://www.elauraacademy.com/..." />
                </div>

                <div className="form-group">
                  <label>Open Graph (OG) Image</label>
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
                  {previewImage && (
                    <img src={previewImage} alt="OG Preview" style={{ width: '150px', height: 'auto', borderRadius: '8px', marginTop: '10px', border: '1px solid #e2e8f0' }} />
                  )}
                  <small style={{ color: '#64748b', display: 'block', marginTop: '5px' }}>Recommended size: 1200 x 630 pixels</small>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiSave /> Save Metadata
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SEOAdmin;
