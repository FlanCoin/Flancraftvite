import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faStore, faStoreAlt, faGamepad, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faYoutube, faTwitter, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './MobileNavbar.css';

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {!menuOpen && (
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faStoreAlt} /> Menu
        </button>
      )}

      <div className={`mobile-navbar ${menuOpen ? 'show' : ''}`}>
        <div className="mobile-navbar-header"></div>

        {/* Flancraft/Stats */}
        <NavLink to="/" className="navbar-link mobile-flancraft-button" activeclassname="active" onClick={closeMenu}>
  <FontAwesomeIcon icon={faGamepad} /> Flancraft
</NavLink>

        <NavLink to="/stats" className="navbar-link" activeclassname="active" onClick={closeMenu}>
          <FontAwesomeIcon icon={faChartLine} /> Stats
        </NavLink>

        <NavLink to="/news" className="navbar-link" activeclassname="active" onClick={closeMenu}>
          <FontAwesomeIcon icon={faNewspaper} /> News
        </NavLink>

        <NavLink to="/store" className="navbar-link mobile-store-button" activeclassname="active" onClick={closeMenu}>
          <FontAwesomeIcon icon={faStore} /> Store
        </NavLink>

        <div className="mobile-navbar-divider"></div>

        <div className="mobile-navbar-socials">
          <a href="https://dsc.gg/flancraft" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://t.me/flancraft" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTelegram} />
          </a>
          <a href="https://www.youtube.com/@Flancraft" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a href="https://www.instagram.com/flancraftserver/" target="_blank" rel="noopener noreferrer">
                       <FontAwesomeIcon icon={faInstagram} />
                    </a>
          <a href="https://x.com/flancraftserver" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://www.tiktok.com/@flancoin?_t=8klrqrfkedo&_r=1" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} />
          </a>
        </div>
      </div>

      <div className={`navbar-overlay ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>
    </>
  );
};

export default MobileNavbar;
