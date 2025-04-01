import React, { useState } from 'react';
import './Play.css';
import playImage from '../assets/play.png';
import tierraImage from '../assets/tierra.gif'; // Actualizado a tierra.gif

const Play = () => {
  const [buttonText, setButtonText] = useState('Join Server');

  const fullText = 'play.flancraft.com';

  const copyIP = () => {
    navigator.clipboard.writeText(fullText);
    setButtonText('Ip copiada');
    setTimeout(() => setButtonText('Join Server'), 2000); // Restaurar el texto después de 2 segundos
  };

  return (
    <div className="play-section">
      <div className="play-image-wrapper">
        <div
          className="play-image"
          style={{ backgroundImage: `url(${playImage})` }}
        ></div>
      </div>

      <div className="play-content">
        <h1 className="play-main-title">¡Juega Flancraft Ahora!</h1>
        <p className="play-main-description">
          ¿Listo para comenzar tu aventura?<br />

          Consigue tu cliente de Minecraft: Java Edition o Bedrock
          .<br />
          ¡No se requieren mods para jugar!
        </p>
        <div className="play-instructions">
          <h2>Cómo jugar a Flancraft:</h2>
          <p>1. Lanza Minecraft: Java/Bedrock Edition.</p>
          <p>2. En "Multijugador", haz clic en "Añadir servidor".</p>
          <p>3. Introduce <strong>play.flancraft.com</strong> como IP.</p>
          <p>4. Confirma para comenzar tu FLANDVENTURE hoy mismo.</p>
        </div>
        <img src={tierraImage} alt="Tierra" className="play-tierra-image" />

        <div className="play-main-button" onClick={copyIP}>
          {buttonText}
        </div>
      </div>
    </div>
  );
};

export default Play;
