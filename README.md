# MyWardrobe

## Resumen Ejecutivo
**MyWardrobe** es una aplicación web multiplataforma diseñada para la gestión inteligente del vestuario personal. La plataforma permite a los usuarios digitalizar su armario físico, categorizar sus prendas y generar combinaciones (outfits) automáticas basadas en criterios estéticos (determinados por etiquetas) y climáticos. El objetivo es profesionalizar la organización personal de la moda, fomentando un consumo responsable y optimizando el tiempo diario del usuario mediante una interfaz minimalista y acogedora.

## Público Objetivo
- Personas que desean maximizar el uso de su colección de ropa.
- Usuarios que buscan automatizar la decisión de "qué ponerse" cada mañana.
- Personas que quieren evitar compras duplicadas y dar una segunda vida a prendas olvidadas.
- Personas indecisas que no consigan elegir qué ponerse cada día.

## Funcionalidades Principales
- **Inventario Digital:** Subida y gestión de prendas con almacenamiento de imágenes reales (Multer).
- **Generador y Gestor de Outfits:** Creación visual e ilimitada de combinaciones de prendas.
- **Paginación Dinámica y Filtros:** Búsqueda en tiempo real y paginación (Cargar más) en todo el armario.
- **Gestión de Perfil Seguro:** Actualización de datos de usuario y cambio de contraseñas seguras mediante bcrypt.
- **Calendario de Estilo (Futuro):** Planificación semanal de qué ropa se va a utilizar.
- **Panel de Tendencias (Futuro):** Espacio para recibir recomendaciones de nuevas prendas basadas en el estilo actual del usuario.

## Arquitectura del Sistema y Tecnologías
- **Frontend:** Aplicación Web desarrollada en **React.js** con **TypeScript** utilizando **Vite** como entorno de construcción.
- **Backend:** API REST desarrollada en **Node.js** con **Express** y **TypeScript**. El backend gestionará la lógica de negocio, el procesamiento de imágenes y la autenticación.
- **Base de Datos:** **MySQL** (ejecutado a través de XAMPP para el entorno de desarrollo local) para la persistencia de datos relacionales (usuarios, prendas y combinaciones). Para las imágenes físicas, se utilizará un almacenamiento de objetos local en fase inicial.

### Justificación del uso de TypeScript
La adopción de **TypeScript** tanto en Frontend como en Backend asegura un entorno de desarrollo mucho más robusto. TS incorpora tipado estático que previene errores tempranos durante el desarrollo, facilita el refactoring del código, mejora el autocompletado en los IDEs y sirve como documentación viva del software. En una aplicación como MyWardrobe, tener interfaces claras e idénticas sobre cómo debe ser la estructura de un *Outfit* o una Prenda* a través del cliente y el servidor reduce drásticamente los errores de comunicación y procesamiento de datos.

## Justificación del Proyecto
La elección de MyWardrobe responde a la creciente digitalización de los servicios personales. En un mercado saturado de consumo rápido (fast fashion), existe una necesidad real de herramientas que ayuden al usuario a valorar y organizar lo que ya posee. Técnicamente, el proyecto permite demostrar competencias avanzadas, desde la gestión compleja de estados en el frontend hasta la arquitectura de microservicios o monolítica y bases de datos relacionales en el backend.

---

## Instrucciones de Arranque (Paso a Paso)

Para arrancar y probar la aplicación en tu entorno local, sigue estas instrucciones:

### 1. Preparación de la Base de Datos
1. Abre **XAMPP Control Panel**.
2. Inicia el módulo **MySQL**.
3. Abre tu navegador y ve a `http://localhost/phpmyadmin` (o usa la consola de MySQL).
4. Crea una nueva base de datos vacía llamada `mywardrobe`. *(Nota: Sequelize creará las tablas automáticamente al conectarse)*.

### 2. Configuración del Backend (Servidor API)
1. Abre una terminal y navega hasta la carpeta del backend: `cd backend`
2. Instala las dependencias (solo la primera vez): `npm install`
3. Crea un archivo `.env` en la raíz de `backend/` tomando como base `.env.example`. Asegúrate de rellenar:
   ```env
   PORT=3000
   DB_NAME=mywardrobe
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   JWT_SECRET=tu_secreto_super_seguro_aqui
   APP_URL=http://localhost:3000
   ```
4. Inicia el servidor en modo desarrollo: `npm run dev`
5. Deberías ver en la terminal que el servidor corre en el puerto 3000 y que la base de datos se sincronizó.

### 3. Configuración del Frontend (Interfaz Web)
1. Abre **una nueva terminal** (manteniendo el backend activo) y navega a la carpeta del frontend: `cd frontend`
2. Instala las dependencias (solo la primera vez): `npm install`
3. Crea un archivo `.env` en la raíz de `frontend/` y asegúrate de apuntar a la API:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Inicia la aplicación React con Vite: `npm run dev`
5. Abre la URL local que muestra la terminal en tu navegador (habitualmente `http://localhost:5173`).

¡Listo! Ya puedes utilizar la interfaz para interactuar con **MyWardrobe**.

---

### 🔑 Usuarios de Prueba (Autoseed)
El backend incluye un sistema de **seeding automático**. La primera vez que arranques el servidor backend, si no detecta usuarios registrados, creará de forma automática una cuenta de prueba para agilizar tus testeos sin necesidad de pasar por el registro manual:

* **Email:** `user@example.com`
* **Contraseña:** `password123`

*(Nota: Por supuesto, también puedes usar el botón "Regístrate" de la aplicación para crear nuevas cuentas personalizadas siempre que quieras).*