import { useEffect, useState } from 'react';
import axios from 'axios';

interface Ticket {
  ID_Ticket: number;
  Titulo: string;
  Descripcion: string;
  Prioridad: string;
  Estado: string;
}

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Definimos la función
    const fetchTickets = async () => {
      try {
        //petición a tu servidor local
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
      <h1>🎫 Dashboard de Incidencias</h1>
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

export default App;