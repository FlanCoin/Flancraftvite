import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faStore, faGamepad, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faYoutube, faTiktok, faTwitter, faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { SectionContext } from '../context/SectionContext';
import './Navbar.css';

const Navbar = () => {
  const { setActiveSection } = useContext(SectionContext);

  const handleFlancraftClick = () => {
    setActiveSection('lobby');
  };

  return (
    <nav className="desktop-navbar">
      <div className="desktop-navbar-socials">
        <a href="https://dsc.gg/flancraft" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faDiscord} />
        </a>
        <a href="https://www.youtube.com/@Flancraft" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a href="https://www.tiktok.com/@flancraftserver" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTiktok} />
        </a>
        <a href="https://www.instagram.com/flancraftserver/" target="_blank" rel="noopener noreferrer">
             <FontAwesomeIcon icon={faInstagram} />
          </a>
            <a href="https://x.com/flancraftserver" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://t.me/flancraft" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faTelegram} />
                    </a>
      </div>

      <div className="desktop-navbar-links">
  <NavLink to="/" className="desktop-navbar-link flancraft-button" onClick={handleFlancraftClick}>
  <FontAwesomeIcon icon={faGamepad} /> Flancraft
  </NavLink>

  <NavLink to="/stats" className="desktop-navbar-link">
    <FontAwesomeIcon icon={faChartLine} /> Stats
  </NavLink>

  <NavLink to="/news" className="desktop-navbar-link">
    <FontAwesomeIcon icon={faNewspaper} /> News
  </NavLink>

  <NavLink to="/store" className="desktop-navbar-link desktop-store-button">
    <FontAwesomeIcon icon={faStore} /> Store
  </NavLink>
</div>
    </nav>
  );
};

export default Navbar;
