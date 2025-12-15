const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

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

// Conexión a la Base de Datos
app.listen(process.env.PORT, async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log('Se conectó a la Base de Datos correctamente');
        console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    } catch (error) {
        console.error('Error al conectar a la Base de Datos:', error);
    }
});

// RUTAS ENDPOINTS

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

// 3. Login de usuario (POST)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await sql.connect(dbSettings);

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Usuarios WHERE Email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = result.recordset[0];

        if (usuario.Password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.json({
            message: 'Login exitoso',
            usuario: {
                id: usuario.ID_Usuario,
                nombre: usuario.Nombre,
                email: usuario.Email,
                rol: usuario.Rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});