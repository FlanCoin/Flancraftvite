import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './PerfilJugador.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function PerfilJugador() {
  const { nombre } = useParams();
  const [sanciones, setSanciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('jails')
        .select('*')
        .eq('name', nombre)
        .order('timestamp', { ascending: false });

      setSanciones(data || []);
      setCargando(false);
    }

    fetchData();
  }, [nombre]);

  const contarStrikes = () => {
    const conteo = {};
    sanciones.forEach((s) => {
      if (s.type) {
        conteo[s.type] = (conteo[s.type] || 0) + 1;
      }
    });
    return conteo;
  };

  const strikes = contarStrikes();
  const permabaneado = sanciones.some((s) => s.estado === 'baneado');

  const nombresServidores = {
    "survival": "Survival 🌲",
    "oneblock": "OneBlock 🧱",
    "anarquico": "Anárquico 🔥",
    "creativo": "Creativo 🎨",
    "boxpvp": "BoxPvP 🥊",
    "kingdoms": "Kingdoms 👑",
    "parkour": "Parkour 🏃‍♂️",
    "play.flancraft.com": "Lobby 🌐",
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

  if (cargando) return <p>Cargando historial...</p>;

  return (
    <div className="perfil-wrapper">
      <h2>Perfil de <span style={{ color: '#3498db' }}>{nombre}</span></h2>

      <div className="perfil-summary-box">
  <div className="avatar-box">
    <img
      src={`https://mc-heads.net/avatar/${nombre}/100`}
      alt={nombre}
      className="avatar"
    />
    <h4 className="player-name">{nombre}</h4>
  </div>

  <div className="datos-box">
    <p>
      <strong>Estado actual:</strong>{' '}
      {permabaneado ? (
        <span className="estado baneado">☠️ PERMABAN</span>
      ) : (
        <span className="estado revisado">✅ ACTIVO</span>
      )}
    </p>
    <p><strong>Total de sanciones:</strong> {sanciones.length}</p>

    <div className="strikes-container">
      <strong>Strikes por tipo:</strong>
      <ul>
        {Object.entries(strikes).map(([tipo, cantidad]) => (
          <li key={tipo}>
            ⚠️ <strong>{tipo}</strong>: {cantidad} strike(s)
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


      <h3 className="perfil-subtitle">Historial completo</h3>
      <table className="sanciones-table">
        <thead>
          <tr>
            <th>Moderador</th>
            <th>Motivo</th>
            <th>Duración</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Servidor</th>
            <th>Observación</th>
            <th>Revisado por</th>
          </tr>
        </thead>
        <tbody>
          {sanciones.map((s, i) => {
            const fechaFin = obtenerFechaFin(s.timestamp, s.duration);
            return (
              <tr key={i}>
                <td>{s.moderator}</td>

                <td>
                  <span className={`tipo ${s.type?.toLowerCase().replace(/\s/g, '-') || 'desconocido'}`}>
                    {s.type ? s.type.charAt(0).toUpperCase() + s.type.slice(1) : 'Sin clasificar'}
                  </span>
                </td>

                <td>
                  {formatearDuracion(s.duration)}
                  {fechaFin && (
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      ⏱ Termina: {fechaFin}
                    </div>
                  )}
                </td>

                <td>{new Date(parseInt(s.timestamp)).toLocaleString('es-ES')}</td>

                <td>
                  <span className={`estado ${s.estado || 'pendiente'}`}>
                    {s.estado === 'baneado' && '☠️ '}
                    {s.estado === 'revisado' && '✅ '}
                    {s.estado === 'pendiente' && '⌛ '}
                    {s.estado || 'pendiente'}
                  </span>
                </td>

                <td>
                  <span className={`server-badge ${s.server?.toLowerCase() || 'desconocido'}`}>
                    {nombresServidores[s.server?.toLowerCase()] || 'Desconocido'}
                  </span>
                </td>

                <td>{s.observacion || '-'}</td>
                <td>{s.revisado_por ? s.revisado_por.split('@')[0] : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/sanciones" className="btn">← Volver a sanciones</Link>
      </div>
    </div>
  );
}
