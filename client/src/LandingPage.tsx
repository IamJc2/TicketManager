import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '3rem', color: '#61dafb' }}>HelpDesk Pro</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
        La solución integral para la gestión de incidencias TI.
        <br />
        Rápido, seguro y eficiente.
      </p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/login">
          <button style={{
            padding: '15px 30px',
            fontSize: '1rem',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Ingresar al Sistema
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div className="card" style={{ maxWidth: '300px' }}>
          <h3>Tiempo Real</h3>
          <p>Reporta fallas y recibe atención inmediata de nuestros especialistas.</p>
        </div>
        <div className="card" style={{ maxWidth: '300px' }}>
          <h3>Seguro</h3>
          <p>Tus datos y reportes están protegidos con estándares corporativos.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;