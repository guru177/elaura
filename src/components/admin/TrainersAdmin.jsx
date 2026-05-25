import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiStar } from 'react-icons/fi';
import './CoursesAdmin.css'; // Reuse the same CSS

const TrainersAdmin = ({ token }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    role: '',
    image: '',
    description: ''
  });

  const url = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/manage_trainers.php' 
    : '/backend/manage_trainers.php';

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTrainers(data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch trainers');
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
        description: ''
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
        fetchTrainers();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Failed to save trainer');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
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
        fetchTrainers();
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting trainer');
    }
  };

  return (
    <div className="admin-courses-wrapper">
      <div className="admin-courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0 }}>Manage Trainers</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Trainer
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading trainers...</div>
      ) : (
        <div className="admin-courses-grid">
          {trainers.map(trainer => (
            <div key={trainer.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
              <div style={{ aspectRatio: '1 / 1', width: '100%', background: '#cbd5e1' }}>
                <img src={trainer.image} alt={trainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 5px 0' }}>{trainer.name}</h4>
                <span style={{ display: 'block', fontSize: '14px', color: '#64748b', fontWeight: 600, marginBottom: '15px' }}>{trainer.role}</span>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, flexGrow: 1, margin: 0 }}>{trainer.description}</p>
                
                <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
                  <button className="btn-edit-full" onClick={() => handleOpenModal(trainer)}>
                    <FiEdit2 /> Edit
                  </button>
                  <button className="btn-delete-full" onClick={() => handleDelete(trainer.id)}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {trainers.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>No trainers found.</div>
          )}
        </div>
      )}

      {/* Trainer Form Modal */}
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
                <h2>{formData.id ? 'Edit Trainer' : 'Add Trainer'}</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              
              <form onSubmit={handleSave} className="admin-modal-body">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Role / Position</label>
                  <input type="text" name="role" value={formData.role} onChange={handleChange} />
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
                  <label>Description</label>
                  <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiSave /> Save Trainer
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

export default TrainersAdmin;
