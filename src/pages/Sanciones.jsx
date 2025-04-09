import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './sanciones.css';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Sanciones() {
  const [sanciones, setSanciones] = useState([]);
  const [filtroJugador, setFiltroJugador] = useState('');
  const [jugadoresBaneados, setJugadoresBaneados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('jails')
        .select('*')
        .order('timestamp', { ascending: false });
      setSanciones(data);

      const baneados = data
        .filter(s => s.estado === 'baneado')
        .map(s => s.name.toLowerCase());
      setJugadoresBaneados([...new Set(baneados)]);
    }

    fetchData();
  }, []);

  const contarStrikes = (jugador, tipo) => {
    return sanciones.filter((s) => s.name === jugador && s.type === tipo).length;
  };

  const obtenerNombreServidor = (raw) => {
    const mapaServidores = {
      'survival': 'Survival 🌲',
      'anarquico': 'Anárquico 🔥',
      'creativo': 'Creativo 🎨',
      'oneblock': 'OneBlock 🧱',
      'kingdoms': 'Kingdoms 👑',
      'boxpvp': 'BoxPvP 🥊',
      'parkour': 'Parkour 🏃‍♂️',
      'play.flancraft.com': 'Lobby 🌐',
    };
    return mapaServidores[raw?.toLowerCase()] || 'Servidor desconocido ❓';
  };

  const formatearDuracion = (duracionRaw) => {
    if (!duracionRaw) return 'Desconocida';

    const match = duracionRaw.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return duracionRaw;

    const valor = parseInt(match[1], 10);
    const unidad = match[2];

    switch (unidad) {
      case 's': return `${valor} segundo${valor > 1 ? 's' : ''}`;
      case 'm': return `${valor} minuto${valor > 1 ? 's' : ''}`;
      case 'h': return `${valor} hora${valor > 1 ? 's' : ''}`;
      case 'd': return `${valor} día${valor > 1 ? 's' : ''}`;
      default: return duracionRaw;
    }
  };

  const obtenerFechaFin = (timestamp, duracionRaw) => {
    const match = duracionRaw?.toLowerCase().match(/(\d+)([smhd])/);
    if (!match) return null;

    const valor = parseInt(match[1], 10);
    const unidad = match[2];

    let ms = 0;
    switch (unidad) {
      case 's': ms = valor * 1000; break;
      case 'm': ms = valor * 60 * 1000; break;
      case 'h': ms = valor * 60 * 60 * 1000; break;
      case 'd': ms = valor * 24 * 60 * 60 * 1000; break;
      default: return null;
    }

    const fechaFin = new Date(parseInt(timestamp) + ms);
    return fechaFin.toLocaleString('es-ES');
  };

  return (
    <div className="sanciones-wrapper">
      <h1 className="sanciones-title">Registro de Sanciones</h1>

      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={filtroJugador}
          onChange={(e) => setFiltroJugador(e.target.value)}
          className="filtro-input"
        />
      </div>
      <div className="leyenda-container">
  <input type="checkbox" id="toggle-leyenda" className="leyenda-toggle" />
  <label htmlFor="toggle-leyenda" className="leyenda-btn">📜 Leyenda</label>

  <div className="leyenda-modal">
    <div className="leyenda-content">
      <label htmlFor="toggle-leyenda" className="close-btn">✖</label>
      <h2>Tabla de Sanciones</h2>
      <table className="leyenda-table">
        <thead>
          <tr>
            <th>Motivo</th>
            <th>1º vez</th>
            <th>2º vez</th>
            <th>3º vez</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Hacks</td><td>Jail 12h</td><td>Jail 5 días</td><td>Ban perm.</td></tr>
          <tr><td>Fly</td><td>Jail 6h</td><td>Jail 3 días</td><td>Ban perm.</td></tr>
          <tr><td>Minar en Survival</td><td>Avisar</td><td>Jail 15 min</td><td>Jail 24h</td></tr>
          <tr><td>Insultos</td><td>Jail 30 min</td><td>Jail 5h</td><td>Ban perm.</td></tr>
          <tr><td>TPAKill</td><td>Jail 6h</td><td>Jail 5 días</td><td>Ban perm.</td></tr>
          <tr><td>Granja de Lag</td><td>Avisar</td><td>Jail 15 min</td><td>Jail 24h</td></tr>
          <tr><td>Grief</td><td>Jail 2h</td><td>Jail 8h</td><td>Jail 5 días</td></tr>
          <tr><td>Spam de server</td><td>Jail 1 día</td><td>Jail 10 días</td><td>Ban perm.</td></tr>
          <tr><td>Flood</td><td>Avisar</td><td>Jail 15 min</td><td>Jail 2h</td></tr>
          <tr><td>Usar bugs</td><td>Jail 2h, 6h, 12h</td><td>Jail 12h, 24h, 2d</td><td>Ban perm.</td></tr>
          <tr><td>Estafas</td><td>Jail 2h, 6h, 12h</td><td>Jail 12h, 24h, 2d</td><td>Ban perm.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

      <table className="sanciones-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Moderador</th>
            <th>Motivo</th>
            <th>Duración</th>
            <th>Fecha</th>
            <th>Servidor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sanciones
            .filter((s) =>
              s.name.toLowerCase().includes(filtroJugador.toLowerCase())
            )
            .map((s, index) => {
              const strikes = contarStrikes(s.name, s.type);
              const fechaFin = obtenerFechaFin(s.timestamp, s.duration);

              return (
                <tr key={index} className="clickable-row">
  <td>
    <div className="player-cell">
      <img
        src={`https://mc-heads.net/avatar/${s.name}/40`}
        alt={s.name}
        className="avatar"
      />
      <span className="player-name">
        <span className="player-link" onClick={() => navigate(`/perfil/${s.name}`)}>
          {s.name}
        </span>
      </span>

      {(s.banType === 'perma' || s.banType === 'temp') && (
        <span className="baneado-badge">BANEADO</span>
      )}
      {jugadoresBaneados.includes(s.name.toLowerCase()) && (
        <span className="permaban-badge">PERMABAN</span>
      )}
    </div>
  </td>

                  <td><strong>{s.moderator}</strong></td>

                  <td>
                    <span className={`tipo ${s.type?.toLowerCase().replace(/\s/g, '-') || 'desconocido'}`}>
                      {s.type ? s.type.charAt(0).toUpperCase() + s.type.slice(1) : 'Sin clasificar'}
                    </span>
                    <br />
                    <span className={`strikes ${strikes >= 3 ? 'permaban' : ''}`}>
                      ⚠️ Strikes: {strikes}
                      {strikes >= 3 && <strong> (Permaban)</strong>}
                    </span>
                  </td>

                  <td>
                    <div>{formatearDuracion(s.duration)}</div>
                    {fechaFin && (
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        ⏱ Finaliza: {fechaFin}
                      </div>
                    )}
                  </td>

                  <td>{new Date(parseInt(s.timestamp)).toLocaleString('es-ES')}</td>

                  <td>
                    <span className={`server-badge ${s.server?.toLowerCase() || 'desconocido'}`}>
                      {obtenerNombreServidor(s.server)}
                    </span>
                  </td>

                  <td>
                    <span className={`estado ${s.estado || 'pendiente'}`}>
                      {s.estado === 'baneado' && '☠️ '}
                      {s.estado === 'revisado' && '✅ '}
                      {s.estado === 'pendiente' && '⌛ '}
                      {s.estado || 'pendiente'}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
