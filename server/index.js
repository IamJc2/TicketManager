const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares (Para que el servidor entienda JSON y permita conexiones)
app.use(express.json());
app.use(cors());

// Configuración de la Base de Datos
const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Importante para Docker local
        trustServerCertificate: true // Importante para desarrollo local
    }
};

// Conexión a la Base de Datos y arranque del servidor
app.listen(process.env.PORT, async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log('Se conectó a la Base de Datos correctamente');
        console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    } catch (error) {
        console.error('Error al conectar a la Base de Datos:', error);
    }
});

// --- RUTAS (ENDPOINTS) ---

// 1. Obtener todos los tickets (GET)
app.get('/tickets', async (req, res) => {
    try {
        const pool = await sql.connect(dbSettings);
        const result = await pool.request().query('SELECT * FROM Tickets');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 2. Crear un nuevo ticket (POST)
app.post('/tickets', async (req, res) => {
    try {
        const { titulo, descripcion, prioridad, id_usuario } = req.body;
        const pool = await sql.connect(dbSettings);
        
        await pool.request()
            .input('titulo', sql.VarChar, titulo)
            .input('descripcion', sql.Text, descripcion)
            .input('prioridad', sql.VarChar, prioridad)
            .input('id_usuario', sql.Int, id_usuario)
            .query('INSERT INTO Tickets (Titulo, Descripcion, Prioridad, ID_Usuario_Reporta) VALUES (@titulo, @descripcion, @prioridad, @id_usuario)');
            
        res.json({ message: 'Ticket creado correctamente' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});