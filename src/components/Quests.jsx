import React from 'react';
import './Quests.css';

const Quests = () => {
  return (
    <section className="quests-section">
      <div className="quests-content">
        {/* Título Principal */}
        <h2 className="quests-title">FlanCraft Battlepass</h2>
        {/* Descripción de la sección */}
        <p className="quests-description">
          ¡Prepárate para un viaje épico! Participa en misiones diarias y semanales, resuelve desafíos y enigmas, y gana increíbles recompensas en Flum.
        </p>

        {/* Grid de Misiones */}
        <div className="quests-grid">
          {/* Misiones Diarias */}
          <div className="quest-card daily-quests">
            <h3>Misiones Diarias</h3>
            <hr /> {/* Línea separadora */}
            <p>Completa misiones rápidas todos los días y gana recompensas en $FLUM.</p>
          </div>

          {/* Misiones Semanales */}
          <div className="quest-card weekly-quests">
            <h3>Misiones Semanales</h3>
            <hr /> {/* Línea separadora */}
            <p>Participa en desafiantes misiones semanales y desbloquea tesoros especiales.</p>
          </div>

          {/* Desafíos Especiales */}
          <div className="quest-card special-challenges">
            <h3>Desafíos y Enigmas</h3>
            <hr /> {/* Línea separadora */}
            <p>Resuelve enigmas y desafíos épicos para obtener premios exclusivos.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quests;
