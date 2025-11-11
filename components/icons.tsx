import React from 'react';

export const TempleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#e5c99b" />
    <path d="M24 10L14 30H34L24 10Z" fill="#8b4513" />
    <rect x="20" y="30" width="8" height="8" rx="2" fill="#8b4513" />
  </svg>
);

export const MandalaPattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#e5c99b" />
    <circle cx="24" cy="24" r="10" stroke="#8b4513" strokeWidth="2" fill="none" />
    <circle cx="24" cy="24" r="5" fill="#8b4513" />
  </svg>
);
