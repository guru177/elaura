import React from 'react';

const ComingSoon = ({ page }) => (
  <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{page}</h1>
    <p style={{ color: 'var(--text-body)' }}>This page is coming soon. Stay tuned!</p>
  </div>
);

export default ComingSoon;
