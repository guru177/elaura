import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiStar } from 'react-icons/fi';
import './CoursesAdmin.css'; // Reuse the same CSS

const TestimonialsAdmin = ({ token }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    role: '',
    image: '',
    text: '',
    stars: 5
  });

  const url = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/manage_testimonials.php' 
    : '/backend/manage_testimonials.php';

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testi = null) => {
    setImageFile(null);
    if (testi) {
      setFormData(testi);
      setPreviewImage(testi.image || '');
    } else {
      setFormData({
        id: null,
        name: '',
        role: '',
        image: '',
        text: '',
        stars: 5
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
    try {
      let fetchOptions = {};
      
      if (imageFile) {
        const fd = new FormData();
        fd.append('action', formData.id ? 'edit' : 'add');
        Object.keys(formData).forEach(key => {
          fd.append(key, formData[key]);
        });
        fd.append('imageFile', imageFile);
        fetchOptions = {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        };
      } else {
        const payload = {
          action: formData.id ? 'edit' : 'add',
          ...formData
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
        fetchTestimonials();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Failed to save testimonial');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
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
        fetchTestimonials();
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting testimonial');
    }
  };

  return (
    <div className="admin-courses-wrapper">
      <div className="admin-courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0 }}>Manage Testimonials</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading testimonials...</div>
      ) : (
        <div className="admin-courses-grid">
          {testimonials.map(testi => (
            <div key={testi.id} className="admin-course-card">
              <div className="admin-course-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                  <img src={testi.image} alt={testi.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{testi.name}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{testi.role}</p>
                  </div>
                </div>
                
                <div style={{ color: '#fbbf24', display: 'flex', marginBottom: '10px' }}>
                  {[...Array(parseInt(testi.stars) || 5)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                </div>
                
                <p style={{ fontSize: '0.95rem', marginBottom: '1rem', flexGrow: 1, fontStyle: 'italic', color: '#475569', lineHeight: '1.5' }}>"{testi.text}"</p>
                
                <div className="admin-course-actions" style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="btn-edit-full" onClick={() => handleOpenModal(testi)}>
                    <FiEdit2 /> Edit
                  </button>
                  <button className="btn-delete-full" onClick={() => handleDelete(testi.id)}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>No testimonials found.</div>
          )}
        </div>
      )}

      {/* Testimonial Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="admin-modal-content"
              style={{ maxWidth: '600px', width: '90%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>{formData.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              
              <form onSubmit={handleSave} className="admin-modal-body">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Role / Position</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Rating (Stars)</label>
                    <input type="number" name="stars" min="1" max="5" value={formData.stars} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Avatar Image</label>
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
                    <img src={previewImage} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }} />
                  )}
                </div>

                <div className="form-group">
                  <label>Testimonial Text *</label>
                  <textarea name="text" rows="4" value={formData.text} onChange={handleChange} required></textarea>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiSave /> Save Testimonial
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

export default TestimonialsAdmin;
