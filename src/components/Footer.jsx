import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.footer
      className={`footer ${isHovered ? 'open' : 'closed'}`}
      initial={{ y: '100%' }}
      animate={{ y: isHovered ? '0%' : '80%' }}
      transition={{ type: 'tween', duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="footer-background"></div> {/* Fondo con la imagen */}
      <div className="footer-content">
        <p className="rights-text">
          <strong>&copy; 2025 FlanCraft. All rights reserved.</strong>
        </p>
        {/* Nueva sección de versión */}
        <div className="version-container">
          <span className="version-text">Beta Version 2.0</span>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
