import React from 'react';
import { FaStar } from 'react-icons/fa';
import './MarqueeSection.css';

const MarqueeSection = () => {
  // We use an array to map multiple repetitions of the text
  const items = Array.from({ length: 12 });

  return (
    <div className="marquee">
      <div className="marquee__inner">
        {/* We duplicate the content to create a seamless infinite scroll loop */}
        <div className="marquee__content">
          {items.map((_, idx) => (
            <React.Fragment key={`marquee1-${idx}`}>
              <span className="marquee__text">Elaura ACADEMY</span>
              <FaStar className="marquee__icon" />
            </React.Fragment>
          ))}
        </div>
        <div className="marquee__content" aria-hidden="true">
          {items.map((_, idx) => (
            <React.Fragment key={`marquee2-${idx}`}>
              <span className="marquee__text">Elaura ACADEMY</span>
              <FaStar className="marquee__icon" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeSection;
