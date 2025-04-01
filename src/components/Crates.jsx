import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la navegación interna
import './Crates.css';
import llaveIcon from '../assets/llave.png'; // Importa la imagen desde src/assets

// Importa las imágenes de los emojis
import coronaIcon from '../assets/emojis/corona.png';
import dineroIcon from '../assets/emojis/dinero.png';
import dosespadasIcon from '../assets/emojis/dosespadas.png';
import escudoIcon from '../assets/emojis/escudo.png';
import estrellaIcon from '../assets/emojis/estrella.png';
import inglesaIcon from '../assets/emojis/inglesa.png';
import llaveEmote from '../assets/emojis/llave.png';
import martillosIcon from '../assets/emojis/martillos.png';
import puñalIcon from '../assets/emojis/puñal.png';
import tridenteIcon from '../assets/emojis/tridente.png';

const createParticle = () => {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.animationDuration = `${Math.random() * 3 + 5}s`;
  return particle;
};

const Crates = () => {
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate(); // Hook para manejar la navegación

  const toggleRewards = (index) => {
    setActiveCard(activeCard === index ? null : index);
  };

  useEffect(() => {
    const particleContainer = document.querySelector('.particle-container');
    for (let i = 0; i < 50; i++) {
      const particle = createParticle();
      particleContainer.appendChild(particle);
    }

    return () => {
      particleContainer.innerHTML = '';
    };
  }, []);

  return (
    <section className="crates-section">
      <div className="crates-background"></div>
      <div className="crates-content">
        <h2 className="crates-title">Crates Mágicas</h2>
        <div className="crates-description">
          ¡Elige tu crate y obtén las mejores recompensas de FlanCraft! Las oportunidades son limitadas, así que actúa rápido.
          <button 
            className="buy-key-button" 
            onClick={() => navigate('/store')} // Navegar internamente a la ruta de la tienda
          >
            <img src={llaveIcon} alt="Buy Key" className="key-icon" />
          </button>
        </div>

        <div className="crates-grid">
          {['Vote Key', 'Legend Key', 'Mythic Key', 'Omega Key'].map((key, index) => (
            <div
              className={`crate-card ${activeCard === index ? 'flipped' : ''}`}
              key={index}
              onClick={() => toggleRewards(index)}
            >
              <div className="crate-card-inner">
                {/* Front Side */}
                <div className="crate-card-front">
                  <h3>{key}</h3>
                  <p>
                    {index === 0 && 'Empieza tu aventura con recompensas básicas pero valiosas. ¡Cada Vote Key te da la posibilidad de conseguir $FLUM!'}
                    {index === 1 && 'Recompensas épicas te esperan. La Legend Key te brinda la oportunidad de ganar $FLUM y objetos raros.'}
                    {index === 2 && 'La Mythic Key ofrece acceso a las recompensas más deseadas. ¿Te atreves a descubrir lo que contiene?'}
                    {index === 3 && 'La Omega Key es la llave definitiva. Accede a objetos divinos y cantidades masivas de $FLUM.'}
                  </p>
                </div>
                {/* Back Side */}
                <div className="crate-card-back">
                  <h3>Recompensas</h3>
                  <p>
                    {index === 0 && (
                      <>
                        <img src={escudoIcon} alt="escudo" className="emoji-icon" /> Armaduras comunes<br />
                        <img src={martillosIcon} alt="martillos" className="emoji-icon" /> Herramientas útiles<br />
                        <img src={llaveEmote} alt="llave" className="emoji-icon" /> Objetos de apoyo<br />
                        <img src={dineroIcon} alt="dinero" className="emoji-icon" /> Pequeñas cantidades de $FLUM
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <img src={escudoIcon} alt="escudo" className="emoji-icon" /> Armaduras raras<br />
                        <img src={martillosIcon} alt="martillos" className="emoji-icon" /> Herramientas mejoradas<br />
                        <img src={estrellaIcon} alt="estrella" className="emoji-icon" /> Objetos especiales<br />
                        <img src={dineroIcon} alt="dinero" className="emoji-icon" /> Cantidades moderadas de $FLUM
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <img src={coronaIcon} alt="corona" className="emoji-icon" /> Armaduras míticas<br />
                        <img src={puñalIcon} alt="puñal" className="emoji-icon" /> Armas especiales<br />
                        <img src={dosespadasIcon} alt="dosespadas" className="emoji-icon" /> Objetos legendarios<br />
                        <img src={dineroIcon} alt="dinero" className="emoji-icon" /> Grandes cantidades de $FLUM
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <img src={tridenteIcon} alt="tridente" className="emoji-icon" /> Objetos divinos<br />
                        <img src={dosespadasIcon} alt="dosespadas" className="emoji-icon" /> Armas ultra legendarias<br />
                        <img src={inglesaIcon} alt="inglesa" className="emoji-icon" /> Equipamiento único<br />
                        <img src={dineroIcon} alt="dinero" className="emoji-icon" /> Cantidades masivas de $FLUM
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="particle-container"></div>
      </div>
    </section>
  );
};

export default Crates;
