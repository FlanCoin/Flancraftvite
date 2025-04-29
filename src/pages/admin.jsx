import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './admin.css';
import { Link, useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function AdminPanel() {
  const [sanciones, setSanciones] = useState([]);
  const [editing, setEditing] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [userEmail, setUserEmail] = useState('');
  const [userRol, setUserRol] = useState('');
  const [motivoEditado, setMotivoEditado] = useState('');
  const navigate = useNavigate();

  const motivos = [
    'hacks', 'fly', 'minar survival', 'insultos', 'tpakill',
    'granja de lag', 'grif', 'spam', 'flood', 'usar bugs', 'estafas', 'otros'
  ];

  useEffect(() => {
    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = '/login';
        return;
      }

      const email = session.user.email;
      setUserEmail(email);

      const { data: rolData } = await supabase
  .from('staff_roles')
  .select('*')
  .eq('email', email)
  .single();

      if (!rolData) {
        alert('No tienes permisos para acceder aquí');
        await supabase.auth.signOut();
        window.location.href = '/login';
        return;
      }

      setUserRol(rolData.rol);
      cargarSanciones();
    }

    verificarSesion();
  }, []);

  const cargarSanciones = async () => {
    const { data } = await supabase
      .from('jails')
      .select('*')
      .order('timestamp', { ascending: false });

    setSanciones(data);
  };

  const guardarCambios = async (sancion) => {
    await supabase
      .from('jails')
      .update({
        observacion,
        estado,
        type: motivoEditado,
        revisado_por: userEmail
      })
      .eq('id', sancion.id);

    cargarSanciones();
    setEditing(null);
    setObservacion('');
    setEstado('pendiente');
    setMotivoEditado('');
  };

  const eliminarSancion = async (sancionId, nombre) => {
    const confirmacion = confirm(`¿Seguro que quieres eliminar la sanción de ${nombre}?`);
    if (!confirmacion) return;

    await supabase
      .from('jails')
      .delete()
      .eq('id', sancionId);

    cargarSanciones();
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
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
    <div className="admin-wrapper">
      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-toolbar">
        <button className="btn volver" onClick={() => navigate('/sanciones')}>← Volver a sanciones</button>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
            Sesión: {userEmail} ({userRol})
          </span>
          <button onClick={cerrarSesion} className="btn logout">Cerrar sesión</button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Motivo</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Observación</th>
            <th>Servidor</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sanciones.map((s) => {
            const fechaFin = obtenerFechaFin(s.timestamp, s.duration);
            return (
              <tr key={s.id}>
                <td>
                  <Link to={`/perfil/${s.name}`} className="player-link">
                    <div className="player-cell">
                      <img
                        src={`https://mc-heads.net/avatar/${s.name}/30`}
                        alt={s.name}
                        className="avatar"
                      />
                      <span style={{ fontWeight: 'bold' }}>{s.name}</span>
                    </div>
                  </Link>
                </td>

                <td>
                  {editing === s.id ? (
                    <select
                      value={motivoEditado}
                      onChange={(e) => setMotivoEditado(e.target.value)}
                    >
                      {motivos.map((motivo) => (
                        <option key={motivo} value={motivo}>
                          {motivo}
                        </option>
                      ))}
                    </select>
                  ) : (
                    s.type || 'Sin clasificar'
                  )}
                </td>

                <td>
                  {formatearDuracion(s.duration)}
                  {fechaFin && (
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      ⏱ Termina: {fechaFin}
                    </div>
                  )}
                </td>

                <td>{s.estado || 'pendiente'}</td>
                <td>{s.observacion || '-'}</td>

                <td>
                  <span className={`server-badge ${s.server?.toLowerCase() || 'desconocido'}`}>
                    {obtenerNombreServidor(s.server)}
                  </span>
                </td>

                <td>
                  {editing === s.id ? (
                    <div className="editor">
                      <textarea
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        placeholder="Escribe observación..."
                      />
                      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="pendiente">Pendiente</option>
                        <option value="revisado">Revisado</option>
                        <option value="baneado">Baneado</option>
                      </select>
                      <button onClick={() => guardarCambios(s)}>💾 Guardar</button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="btn"
                        onClick={() => {
                          setEditing(s.id);
                          setObservacion(s.observacion || '');
                          setEstado(s.estado || 'pendiente');
                          setMotivoEditado(s.type || 'otros');
                        }}
                      >
                        ✏️ Editar
                      </button>

                      {(userRol === 'admin' || userRol === 'owner') && (
                        <button
                          className="btn eliminar"
                          onClick={() => eliminarSancion(s.id, s.name)}
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
