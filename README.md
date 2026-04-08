# MyWardrobe

## Resumen Ejecutivo
**MyWardrobe** es una aplicación web multiplataforma diseñada para la gestión inteligente del vestuario personal. La plataforma permite a los usuarios digitalizar su armario físico, categorizar sus prendas y generar combinaciones (outfits) automáticas basadas en criterios estéticos (determinados por etiquetas) y climáticos. El objetivo es profesionalizar la organización personal de la moda, fomentando un consumo responsable y optimizando el tiempo diario del usuario mediante una interfaz minimalista y acogedora.

## Público Objetivo
- Personas que desean maximizar el uso de su colección de ropa.
- Usuarios que buscan automatizar la decisión de "qué ponerse" cada mañana.
- Personas que quieren evitar compras duplicadas y dar una segunda vida a prendas olvidadas.
- Personas indecisas que no consigan elegir qué ponerse cada día.

## Funcionalidades Principales
- **Inventario Digital:** Subida y gestión de prendas con metadatos (tipo, color, temporada, tejido).
- **Generador de Outfits:** Algoritmo que sugiere combinaciones de ropa coherentes para eventos o el día a día.
- **Calendario de Estilo:** Planificación semanal de qué ropa se va a utilizar.
- **Filtros Avanzados:** Búsqueda rápida por etiquetas o estados (lavandería, prestado, disponible).
- **Panel de Tendencias:** Espacio para recibir recomendaciones de nuevas prendas basadas en el estilo actual del usuario.

## Arquitectura del Sistema y Tecnologías
- **Frontend:** Aplicación Web desarrollada en **React.js** con **TypeScript** utilizando **Vite** como entorno de construcción.
- **Backend:** API REST desarrollada en **Node.js** con **Express** y **TypeScript**. El backend gestionará la lógica de negocio, el procesamiento de imágenes y la autenticación.
- **Base de Datos:** **MySQL** (ejecutado a través de XAMPP para el entorno de desarrollo local) para la persistencia de datos relacionales (usuarios, prendas y combinaciones). Para las imágenes físicas, se utilizará un almacenamiento de objetos local en fase inicial.

### Justificación del uso de TypeScript
La adopción de **TypeScript** tanto en Frontend como en Backend asegura un entorno de desarrollo mucho más robusto. TS incorpora tipado estático que previene errores tempranos durante el desarrollo, facilita el refactoring del código, mejora el autocompletado en los IDEs y sirve como documentación viva del software. En una aplicación como MyWardrobe, tener interfaces claras e idénticas sobre cómo debe ser la estructura de un *Outfit* o una Prenda* a través del cliente y el servidor reduce drásticamente los errores de comunicación y procesamiento de datos.

## Justificación del Proyecto
La elección de MyWardrobe responde a la creciente digitalización de los servicios personales. En un mercado saturado de consumo rápido (fast fashion), existe una necesidad real de herramientas que ayuden al usuario a valorar y organizar lo que ya posee. Técnicamente, el proyecto permite demostrar competencias avanzadas, desde la gestión compleja de estados en el frontend hasta la arquitectura de microservicios o monolítica y bases de datos relacionales en el backend.