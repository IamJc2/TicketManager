import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';

// Actualizamos la interfaz para recibir el nombre del usuario
interface Ticket {
  ID_Ticket: number;
  Titulo: string;
  Descripcion: string;
  Prioridad: string;
  Estado: string;
  NombreUsuario: string;
}

function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [recargarTabla, setRecargarTabla] = useState(0); 
  
  // Inputs del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');

  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esAdmin = usuarioLogueado.rol === 'Admin';

  // Seguridad
  useEffect(() => {
    if (!usuarioLogueado.id) navigate('/login');
  }, [navigate, usuarioLogueado.id]);

  // Cargar Tickets
  useEffect(() => {
    if (!usuarioLogueado.id) return;
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tickets', {
            params: { userId: usuarioLogueado.id, role: usuarioLogueado.rol }
        });
        setTickets(response.data);
      } catch (error) {
        console.error("Error cargando tickets:", error);
      }
    };
    fetchTickets();
  }, [recargarTabla, usuarioLogueado.id, usuarioLogueado.rol]);

  // Crear Ticket
  const handleCrearTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/tickets', {
        titulo, descripcion, prioridad, id_usuario: usuarioLogueado.id 
      });
      alert('Ticket creado con éxito');
      setMostrarFormulario(false);
      setTitulo(''); setDescripcion('');
      setRecargarTabla(prev => prev + 1); 
    } catch (error) {
      console.error(error);
    }
  };

  // Función para RESOLVER ticket
  const handleResolver = async (id: number) => {
    if (!confirm('¿Marcar este ticket como resuelto y archivarlo?')) return;
    try {
      await axios.put(`http://localhost:5000/tickets/${id}/resolver`);
      setRecargarTabla(prev => prev + 1); 
    } catch (error) {
      console.error(error);
      alert('Error al resolver');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  // Función para obtener color según prioridad
  const getColorPrioridad = (p: string) => {
    if (p === 'Alta') return '#dc3545'; // Rojo
    if (p === 'Media') return '#ffc107'; // Amarillo
    return '#28a745'; // Verde
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <div>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <small style={{ color: '#888' }}>Bienvenido, {usuarioLogueado.nombre} ({usuarioLogueado.rol})</small>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#333', color: 'white', border: '1px solid #555', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      {/* Botón Nuevo Ticket */}
      {!mostrarFormulario && (
        <button 
          onClick={() => setMostrarFormulario(true)}
          style={{ backgroundColor: '#007acc', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span>+</span> Crear Nuevo Ticket
        </button>
      )}

      {/* Formulario Estilizado */}
      {mostrarFormulario && (
        <div className="card" style={{ borderLeft: '5px solid #007acc', marginBottom: '30px', backgroundColor: '#1e1e1e', padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Nuevo Reporte</h3>
          <form onSubmit={handleCrearTicket} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Asunto del problema" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2d2d2d', color: 'white' }} />
            <textarea placeholder="Describe el detalle..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required style={{ padding: '12px', minHeight: '100px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2d2d2d', color: 'white' }} />
            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2d2d2d', color: 'white' }}>
              <option value="Baja">Prioridad Baja</option>
              <option value="Media">Prioridad Media</option>
              <option value="Alta">Prioridad Alta</option>
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ backgroundColor: '#007acc', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Guardar Ticket</button>
              <button type="button" onClick={() => setMostrarFormulario(false)} style={{ backgroundColor: 'transparent', color: '#ccc', border: '1px solid #555', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="ticket-list" style={{ display: 'grid', gap: '20px' }}>
        {tickets.length === 0 ? <p style={{ textAlign: 'center', color: '#666' }}>No hay tickets pendientes.</p> : null}
        
        {tickets.map((ticket) => (
          <div key={ticket.ID_Ticket} className="card" style={{ 
              backgroundColor: '#1e1e1e', 
              borderRadius: '10px', 
              padding: '20px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              borderLeft: `5px solid ${getColorPrioridad(ticket.Prioridad)}`,
              position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{ticket.Titulo}</h3>
                    {esAdmin && (
                        <span style={{ fontSize: '0.85rem', color: '#aaa', backgroundColor: '#333', padding: '2px 8px', borderRadius: '10px' }}>
                            👤 {ticket.NombreUsuario}
                        </span>
                    )}
                </div>
                <span style={{ 
                    color: getColorPrioridad(ticket.Prioridad), 
                    fontWeight: 'bold', 
                    fontSize: '0.8rem', 
                    border: `1px solid ${getColorPrioridad(ticket.Prioridad)}`, 
                    padding: '2px 8px', 
                    borderRadius: '4px' 
                }}>
                    {ticket.Prioridad.toUpperCase()}
                </span>
            </div>

            <p style={{ color: '#ddd', lineHeight: '1.5', marginBottom: '20px' }}>{ticket.Descripcion}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #333', paddingTop: '15px' }}>
                {esAdmin && (
                  <button 
                      onClick={() => handleResolver(ticket.ID_Ticket)}
                      style={{ 
                          backgroundColor: 'transparent', 
                          color: '#28a745', 
                          border: '1px solid #28a745', 
                          padding: '8px 15px', 
                          borderRadius: '5px', 
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#28a74520'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                      Marcar Resuelto
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- App Principal ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;