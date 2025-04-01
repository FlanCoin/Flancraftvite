import React from 'react';
import './SlimeFun.css';

// Importar las imágenes
import slimefunBackground from '../assets/slimefun-background.png';
import flanSlimeGif from '../assets/flanslime.gif';

const SlimeFun = () => {
  return (
    <section className="slimefun-section">
      {/* Contenedor del Texto */}
      <div className="slimefun-text-content">
        <h1 className="slimefun-title">Bienvenidos a SlimeFun</h1>
        <h2 className="slimefun-subtitle">¡El plugin que lo cambia todo en Flancraft!</h2>
        <p className="slimefun-description">
          ¿Te imaginas tener un modpack completo sin tener que instalar mods? ¡Eso es lo que hace SlimeFun! 
          Con nuevas recetas, mecánicas avanzadas y biomas para explorar, SlimeFun transforma tu mundo de Minecraft en una experiencia épica.
        </p>
        <ul className="slimefun-features">
          <li>¡Nuevas recetas y herramientas increíbles!</li>
          <li>Automatiza, explora y construye como nunca antes.</li>
          <li>Personaliza tu mundo con bloques únicos.</li>
        </ul>
      </div>

      {/* Contenedor de la imagen de fondo */}
      <div className="slimefun-background-container">
        <img src={slimefunBackground} alt="Slimefun Background" className="slimefun-background-image" />
      </div>

      {/* Contenedor del GIF */}
      <div className="slimefun-gif-container">
        <img src={flanSlimeGif} alt="Flan Slime" className="slimefun-gif" />
      </div>
    </section>
  );
};

export default SlimeFun;
