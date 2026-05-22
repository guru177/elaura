import React from 'react';
import './SectionTitle.css';

/**
 * SectionTitle — consistent section headings
 * @param {string} badge      - small badge text above heading
 * @param {string} title      - main heading (can include <span> for highlighting)
 * @param {string} subtitle   - paragraph below heading
 * @param {'center'|'left'}  align
 */
const SectionTitle = ({ badge, title, subtitle, align = 'center', className = '' }) => {
  return (
    <div className={`section-title section-title--${align} ${className}`}>
      {badge && (
        <span className="section-title__badge">
          {badge}
        </span>
      )}
      <h2
        className="section-title__heading"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className={`divider ${align === 'left' ? 'divider--left' : ''}`} />
      {subtitle && (
        <p className="section-title__subtitle">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
