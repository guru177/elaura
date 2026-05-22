import React, { useState, useEffect } from 'react';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import './HeroSection.css';
import heroBg from '../../assets/1.jpg';
import slide2Bg from '../../assets/2.jpg';
import slide3Bg from '../../assets/3.jpg';

const slides = [
  { id: 1, title: 'E L A U R A', subtitle: 'E M P O W E R I N G &nbsp; M I N D S, &nbsp; S H A P I N G &nbsp; F U T U R E S', image: heroBg },
  { id: 2, title: 'I N N O V A T E', subtitle: 'D I S C O V E R &nbsp; Y O U R &nbsp; P O T E N T I A L', image: slide2Bg },
  { id: 3, title: 'I N S P I R E', subtitle: 'L E A D I N G &nbsp; T H E &nbsp; W A Y &nbsp; T O &nbsp; E X C E L L E N C E', image: slide3Bg },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="hero">
      {/* Background Slider */}
      {slides.map((s, index) => (
        <div 
          key={s.id} 
          className={`hero__bg ${index === current ? 'hero__bg--active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Dark overlay */}
      <div className="hero__overlay"></div>

      <div className="hero__center" key={current}>
        <h3 className="hero__subtitle animate-fadeUp" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />
        <h1 className="hero__title animate-fadeUp delay-100">{slide.title}</h1>
      </div>

      <div className="hero__bottom">
        <div className="hero__bottom-inner">
          <div className="hero__desc animate-slideLeft">
            <p>This world-class institute hides the most surprising<br />opportunities in pockets of excellence.</p>
          </div>
          
          <div className="hero__action animate-fadeUp delay-200">
            <button className="hero__btn">EXPLORE COURSES</button>
          </div>

          <div className="hero__nav animate-slideRight">
            <button className="hero__nav-arrow" onClick={prevSlide}>
              <HiArrowLeft /> <span className="hero__nav-text" style={{marginLeft: '6px'}}>PREV</span>
            </button>
            <div style={{width: '20px'}}></div>
            <button className="hero__nav-arrow" onClick={nextSlide}>
              <span className="hero__nav-text" style={{marginRight: '6px'}}>NEXT</span> <HiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
