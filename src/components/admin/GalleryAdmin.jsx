import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiTrash2, FiImage } from 'react-icons/fi';
import './CoursesAdmin.css';

const GalleryAdmin = ({ token }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [caption, setCaption] = useState('');

  const url = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/manage_gallery.php' 
    : '/backend/manage_gallery.php';

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setImageFile(null);
    setPreviewImage('');
    setCaption('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }
    
    try {
      const fd = new FormData();
      fd.append('action', 'save');
      fd.append('caption', caption);
      fd.append('imageFile', imageFile);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      
      const result = await res.json();
      if (result.status === 'success') {
        fetchImages();
        setIsModalOpen(false);
      } else {
        alert(result.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
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
        fetchImages();
      } else {
        alert(result.message || 'Failed to delete image');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting image');
    }
  };

  return (
    <div className="admin-courses-wrapper">
      <div className="admin-courses-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0 }}>Gallery Management</h2>
        <button className="btn-add" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Upload New Image
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading gallery...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {images.map(img => (
            <div key={img.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', position: 'relative' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', background: '#f1f5f9' }}>
                <img src={img.image_url} alt={img.caption || 'Gallery Image'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => handleDelete(img.id)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                  title="Delete Image"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <div style={{ padding: '15px' }}>
                <p style={{ margin: 0, color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>{img.caption || 'No caption'}</p>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <FiImage size={40} color="#94a3b8" style={{ marginBottom: '15px' }} />
              <p style={{ margin: 0, color: '#64748b' }}>No images in the gallery yet. Click "Upload New Image" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="admin-modal-content"
              style={{ maxWidth: '500px', width: '90%' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>Upload to Gallery</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><FiX /></button>
              </div>
              
              <form onSubmit={handleSave} className="admin-modal-body">
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Select Image (4:3 ratio recommended) *</label>
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
                    required 
                    style={{ border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                  />
                  {previewImage && (
                    <div style={{ marginTop: '15px', width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Caption (Optional)</label>
                  <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="E.g., Students at the graduation ceremony" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>

                <div className="admin-modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiPlus /> Upload
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

export default GalleryAdmin;
