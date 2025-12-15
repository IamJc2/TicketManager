USE TicketManagerDB;
GO

ALTER TABLE Usuarios
ADD Password VARCHAR(255);
GO

UPDATE Usuarios
SET Password = 'admin123'
WHERE Rol = 'Admin';

UPDATE Usuarios
SET Password = 'user123'
WHERE Rol = 'Usuario';

SELECT ID_Usuario, Nombre, Email, Rol, Password FROM Usuarios;
GO

UPDATE Usuarios
SET Email = 'jose@gmail.com' 
WHERE ID_Usuario = 1;
GO

SELECT * FROM Usuarios;
GO