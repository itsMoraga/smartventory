# 🧠 Smartventory

**Smartventory** es una aplicación enfocada en la **gestión inteligente de inventarios**, diseñada para optimizar el control de productos y movimientos dentro de una empresa.  
Este repositorio corresponde al **backend del proyecto**, encargado de la lógica del servidor y la conexión con la base de datos.

---

## 🚀 Características principales

- API REST desarrollada con **Node.js** y **Express**.
- Conexión a base de datos **MySQL**.
- Arquitectura organizada por módulos: controladores, rutas y configuración.
- Configuración mediante variables de entorno.
- Preparado para ampliarse hacia un frontend y nuevas funcionalidades.

---

## 🗂️ Estructura del proyecto

smartventory/
├── src/
│ ├── controllers/ # Lógica de negocio (productos, usuarios, etc.)
│ ├── routes/ # Endpoints del servidor
│ ├── config/ # Configuración de la base de datos y entorno
│ └── app.js # Configuración principal de Express
├── server.js # Punto de entrada del servidor
├── package.json # Dependencias y scripts
├── .env # Variables de entorno (no se sube al repositorio)
└── .gitignore # Archivos a ignorar por Git

## ⚙️ Tecnologías utilizadas

- **Node.js** – entorno de ejecución.
- **Express.js** – framework para manejar rutas y middleware.
- **MySQL** – base de datos relacional.
- **dotenv** – para manejar variables de entorno.
- **Nodemon** *(opcional)* – para ejecutar el servidor en desarrollo.
