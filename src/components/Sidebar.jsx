import React, { useState, useContext, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { SectionContext } from '../context/SectionContext';
import inicioIcon from '../assets/sidebar/botoninicio.png';
import dungeonsIcon from '../assets/sidebar/botondungeons.png';
import slimeIcon from '../assets/sidebar/botonslime.png';
import cratesIcon from '../assets/sidebar/botoncrates.png';
import questsIcon from '../assets/sidebar/botonmisiones.png';
import playIcon from '../assets/sidebar/botonplay.png';
import './Sidebar.css';

function Sidebar() {
  const { activeSection, setActiveSection } = useContext(SectionContext);
  const [collapsed, setCollapsed] = useState(false);

  // Memorizar el array de secciones para evitar que cambie en cada render
  const sections = useMemo(() => ['lobby', 'dungeon', 'slimefun', 'crates', 'quests', 'play'], []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Función para manejar el clic en una sección
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Usar IntersectionObserver para detectar la sección visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visibleSection = entry.target.id;
            setActiveSection(visibleSection); // Actualizar la sección visible en el contexto
          }
        });
      },
      {
        root: null, // El viewport es el root
        threshold: 0.6, // Detectar cuando el 60% de la sección es visible
      }
    );

    // Observar todas las secciones
    sections.forEach((section) => {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    return () => {
      // Dejar de observar cuando el componente se desmonte
      sections.forEach((section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          observer.unobserve(sectionElement);
        }
      });
    };
  }, [sections, setActiveSection]);

  const handleArrowClick = (direction) => {
    const currentIndex = sections.indexOf(activeSection);

    if (direction === 'up' && currentIndex > 0) {
      handleSectionClick(sections[currentIndex - 1]);
    } else if (direction === 'down' && currentIndex < sections.length - 1) {
      handleSectionClick(sections[currentIndex + 1]);
    }
  };

  const isTopArrowDisabled = activeSection === 'lobby';
  const isBottomArrowDisabled = activeSection === 'play';

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}></div>
      <div className="sidebar-nav">
        {/* Links del sidebar */}
        <div
          className={`sidebar-link ${activeSection === 'lobby' ? 'active' : ''}`}
          onClick={() => handleSectionClick('lobby')}
          data-tooltip="Lobby"
        >
          <img src={inicioIcon} alt="Lobby" className="sidebar-icon" />
        </div>
        <div
          className={`sidebar-link ${activeSection === 'dungeon' ? 'active' : ''}`}
          onClick={() => handleSectionClick('dungeon')}
          data-tooltip="Dungeon"
        >
          <img src={dungeonsIcon} alt="Dungeon" className="sidebar-icon" />
        </div>
        <div
          className={`sidebar-link ${activeSection === 'slimefun' ? 'active' : ''}`}
          onClick={() => handleSectionClick('slimefun')}
          data-tooltip="Slimefun"
        >
          <img src={slimeIcon} alt="Slimefun" className="sidebar-icon" />
        </div>
        <div
          className={`sidebar-link ${activeSection === 'crates' ? 'active' : ''}`}
          onClick={() => handleSectionClick('crates')}
          data-tooltip="Crates"
        >
          <img src={cratesIcon} alt="Crates" className="sidebar-icon" />
        </div>
        <div
          className={`sidebar-link ${activeSection === 'quests' ? 'active' : ''}`}
          onClick={() => handleSectionClick('quests')}
          data-tooltip="Quests"
        >
          <img src={questsIcon} alt="Quests" className="sidebar-icon" />
        </div>
        <div
          className={`sidebar-link ${activeSection === 'play' ? 'active' : ''}`}
          onClick={() => handleSectionClick('play')}
          data-tooltip="Play"
        >
          <img src={playIcon} alt="Play" className="sidebar-icon" />
        </div>
      </div>

      {/* Flechas de navegación */}
      <div
        className={`sidebar-arrow top ${isTopArrowDisabled ? 'disabled' : ''}`}
        onClick={() => !isTopArrowDisabled && handleArrowClick('up')}
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </div>
      <div
        className={`sidebar-arrow bottom ${isBottomArrowDisabled ? 'disabled' : ''}`}
        onClick={() => !isBottomArrowDisabled && handleArrowClick('down')}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
    </div>
  );
}

export default Sidebar;
