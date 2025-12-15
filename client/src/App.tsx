import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login'; 

// --- Interfaces y Componente Dashboard 
interface Ticket {
  ID_Ticket: number;
  Titulo: string;
  Descripcion: string;
  Prioridad: string;
  Estado: string;
}

function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Error cargando tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🎫 Dashboard de Incidencias</h1>
        <a href="/" style={{ textDecoration: 'none', color: '#61dafb', border: '1px solid #61dafb', padding: '5px 10px', borderRadius: '4px' }}>
          ⬅ Cerrar Sesión
        </a>
      </div>
      <p>Sistema conectado a SQL Server v.2022</p>
      
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <div key={ticket.ID_Ticket} className="card">
            <h3>{ticket.Titulo} <small>({ticket.Prioridad})</small></h3>
            <p>{ticket.Descripcion}</p>
            <span>Estado: <strong>{ticket.Estado}</strong></span>
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