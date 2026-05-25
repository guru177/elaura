import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMaximize2, FiX, FiImage } from 'react-icons/fi';
import './Contact.css'; // For the page-hero
import './Gallery.css'; // Custom gallery styles

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const url = window.location.hostname === 'localhost' 
          ? 'http://localhost:8000/manage_gallery.php' 
          : '/backend/manage_gallery.php';
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setImages(data);
        }
      } catch (err) {
        console.error('Failed to fetch gallery images', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <img 
            src="/students-studying-graduating.jpg" 
            alt="Gallery Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="page-hero-overlay"></div>
        </div>
        <div className="page-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1>Gallery</h1>
            <p>Glimpses of campus life, events, and moments of achievement at Elaura Academy.</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading gallery...</div>
        ) : images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((img, index) => (
              <motion.div 
                key={img.id}
                className="gallery-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.image_url} alt={img.caption || `Gallery ${img.id}`} className="gallery-img" loading="lazy" />
                <div className="gallery-overlay">
                  <FiMaximize2 className="gallery-icon-expand" />
                </div>
                {img.caption && (
                  <div className="gallery-caption">{img.caption}</div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <FiImage size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h3>No Images Yet</h3>
            <p>Our gallery is currently being updated. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Full Screen Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="gallery-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="gallery-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="gallery-modal-close" onClick={() => setSelectedImage(null)}>
                <FiX />
              </button>
              <img src={selectedImage.image_url} alt={selectedImage.caption || 'Expanded Image'} className="gallery-modal-img" />
              {selectedImage.caption && (
                <div className="gallery-modal-caption">{selectedImage.caption}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
