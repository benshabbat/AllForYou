// Skip Links Component - WCAG 2.1 AA Compliance
// Provides keyboard users quick navigation to main content areas

import React from 'react';
import './SkipLinks.module.css';

const SkipLinks = ({ links = [] }) => {
  if (links.length === 0) {
    // Default skip links for common page structure
    const defaultLinks = [
      { href: '#main-content', label: 'Skip to main content' },
      { href: '#main-navigation', label: 'Skip to navigation' },
      { href: '#search', label: 'Skip to search' },
      { href: '#footer', label: 'Skip to footer' }
    ];
    
    return (
      <div className="skip-links" aria-label="Skip links">
        {defaultLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="skip-link"
            onClick={(e) => {
              const target = document.querySelector(link.href);
              if (target) {
                e.preventDefault();
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="skip-links" aria-label="Skip links">
      {links.map((link, index) => (
        <a
          key={index}
          href={`#${link.id}`}
          className="skip-link"
          onClick={(e) => {
            const target = document.getElementById(link.id);
            if (target) {
              e.preventDefault();
              target.focus();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;