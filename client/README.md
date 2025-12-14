# TicketManager System

Sistema de gestión de incidencias.

## Arquitectura y Tecnologías
Este proyecto implementa una arquitectura de 3 capas siguiendo el patrón MVC/REST:

* **Base de Datos:** SQL Server.
* **Backend:** Node.js + Express (API RESTful).
* **Frontend:** React + TypeScript + Vite.

## Características
* **Conexión Real:** Comunicación asíncrona entre Cliente y Servidor.
* **Persistencia:** Almacenamiento relacional en SQL Server.

## Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install` en carpetas `/client` y `/server`.
3. Configurar variables de entorno `.env` en server.
4. Levantar entorno: `npm run dev`.