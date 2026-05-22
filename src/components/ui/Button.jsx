import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/button.css';

/**
 * Button component
 * @param {'primary'|'accent'|'outline'|'outline-white'|'ghost'} variant
 * @param {'sm'|'base'|'lg'} size
 * @param {string} to   - renders as <Link> if provided
 * @param {string} href - renders as <a> if provided
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'base',
  to,
  href,
  className = '',
  icon,
  ...props
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'base' ? `btn--${size}` : '',
    className,
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
