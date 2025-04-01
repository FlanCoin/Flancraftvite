// src/components/Dungeon.js
import React, { useEffect, useRef } from 'react';
import './Dungeon.css';
import dungeonImage from '../assets/dungeon.png';
import Plyr from 'plyr'; // Importar Plyr

const Dungeon = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = new Plyr(videoRef.current, {
      controls: [], // Desactivamos todos los controles visuales
      autoplay: true,
      muted: true,
    });

    // Forzar autoplay manual si falla el del player
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.play().catch((error) => {
        console.warn('Autoplay blocked by browser:', error);
      });
    }

    return () => {
      player.destroy();
    };
  }, []);


  return (
    <section className="dungeon-section">
      <img src={dungeonImage} alt="Dungeon" className="dungeon-image" />

      {/* Contenedor del video */}
      <div className="dungeon-video-container">
        <video
          id="player"
          className="dungeon-video"
          controls
          loop
          ref={videoRef} // Usamos ref para manipular el video en el useEffect
        >
          <source src="https://flancoin.github.io/flancraft-audio/trailer.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="light-beam"></div>
      <div className="dungeon-content">
        <h1 className="dungeon-title">Dungeon Adventures</h1>
        <h2 className="dungeon-subtitle">¡Explora y conquista mazmorras épicas!</h2>
        <p className="dungeon-description">
          Únete a la aventura en nuestra nueva implementación de Dungeon en Flancraft.
          Entra con tus amigos y explora mazmorras llenas de sorpresas y recompensas épicas.
        </p>
        <div className="dungeon-features">
          <ul>
            <h4>Explora mazmorras únicas y desafiantes</h4>
            <h4>Encuentra tesoros escondidos</h4>
            <h4>Compite con tus amigos en emocionantes batallas</h4>
            <h4>Gana recompensas épicas y exclusivas</h4>
          </ul>
        </div>
      </div>
      <div className="snowflakes pointer-events-none z-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: Math.random() * 0.5 + 0.5,
              transform: `scale(${Math.random() + 0.5})`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Dungeon;
