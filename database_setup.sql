-- 1. Crear la Base de Datos
CREATE DATABASE TicketManagerDB;
GO

USE TicketManagerDB;
GO

-- 2. Tabla de Usuarios (Quién reporta o quién resuelve)
CREATE TABLE Usuarios (
    ID_Usuario INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Rol VARCHAR(20) CHECK (Rol IN ('Admin', 'Usuario')) DEFAULT 'Usuario',
    FechaCreacion DATETIME DEFAULT GETDATE()
);

-- 3. Tabla de Tickets (Las incidencias)
CREATE TABLE Tickets (
    ID_Ticket INT IDENTITY(1,1) PRIMARY KEY,
    Titulo VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Prioridad VARCHAR(10) CHECK (Prioridad IN ('Baja', 'Media', 'Alta')),
    Estado VARCHAR(20) CHECK (Estado IN ('Abierto', 'En Proceso', 'Resuelto')) DEFAULT 'Abierto',
    ID_Usuario_Reporta INT, -- Relación con Usuarios
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_Usuario_Reporta) REFERENCES Usuarios(ID_Usuario)
);

-- 4. Insertar datos de prueba (Para que no esté vacío)
INSERT INTO Usuarios (Nombre, Email, Rol) VALUES 
('José Cueto', 'jose@ids.com', 'Admin'),
('Cliente Prueba', 'cliente@empresa.com', 'Usuario');

INSERT INTO Tickets (Titulo, Descripcion, Prioridad, ID_Usuario_Reporta) VALUES 
('Error en Login', 'El usuario no puede ingresar con credenciales correctas', 'Alta', 2),
('Pantalla azul', 'La app se cierra al abrir reportes', 'Media', 2);

-- 5. Comprobar que funciona
SELECT * FROM Tickets;