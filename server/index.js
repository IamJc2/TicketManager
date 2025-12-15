import express from 'express';
import cors from 'cors';
import sql from 'mssql';

const app = express();
app.use(cors());
app.use(express.json());

const dbSettings = {
    user: 'sa',
    password: '123456', 
    server: 'localhost',
    database: 'TicketManagerDB',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

// 1. Login (Se mantiene igual)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await sql.connect(dbSettings);
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Usuarios WHERE Email = @email');

        if (result.recordset.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const usuario = result.recordset[0];
        if (usuario.Password !== password) return res.status(401).json({ message: 'Contraseña incorrecta' });

        res.json({
            message: 'Login exitoso',
            usuario: { id: usuario.ID_Usuario, nombre: usuario.Nombre, email: usuario.Email, rol: usuario.Rol }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// 2. Obtener Tickets (MEJORADO: Con JOIN y Filtro de Estado)
app.get('/tickets', async (req, res) => {
    try {
        const { userId, role } = req.query; 
        const pool = await sql.connect(dbSettings);
        
        // Hacemos JOIN para traer el nombre del usuario
        let query = `
            SELECT T.*, U.Nombre as NombreUsuario 
            FROM Tickets T
            INNER JOIN Usuarios U ON T.ID_Usuario_Reporta = U.ID_Usuario
            WHERE T.Estado = 'Abierto'
        `;
        
        // Si no es Admin, filtro adicional
        if (role !== 'Admin') {
            query += ' AND T.ID_Usuario_Reporta = @userId';
        }

        // Ordenamos por prioridad (Alta sale primero)
        query += ` ORDER BY 
            CASE WHEN T.Prioridad = 'Alta' THEN 1 
                 WHEN T.Prioridad = 'Media' THEN 2 
                 ELSE 3 END ASC`;

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// 3. Crear Ticket (Se mantiene igual)
app.post('/tickets', async (req, res) => {
    try {
        const { titulo, descripcion, prioridad, id_usuario } = req.body;
        const pool = await sql.connect(dbSettings);
        await pool.request()
            .input('titulo', sql.VarChar, titulo)
            .input('descripcion', sql.Text, descripcion)
            .input('prioridad', sql.VarChar, prioridad)
            .input('id_usuario', sql.Int, id_usuario)
            .query('INSERT INTO Tickets (Titulo, Descripcion, Prioridad, Estado, ID_Usuario_Reporta) VALUES (@titulo, @descripcion, @prioridad, \'Abierto\', @id_usuario)');
        
        res.json({ message: 'Ticket creado' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// 4. NUEVA RUTA: Resolver Ticket (Cambiar estado)
app.put('/tickets/:id/resolver', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(dbSettings);
        
        await pool.request()
            .input('id', sql.Int, id)
            .query("UPDATE Tickets SET Estado = 'Resuelto' WHERE ID_Ticket = @id");

        res.json({ message: 'Ticket resuelto' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al resolver ticket');
    }
});

app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));