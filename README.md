# 🍽️ RestaurantSpace

**RestaurantSpace** es un sistema web diseñado para la **gestión y administración integral de un restaurante**.  
Permite organizar reservas de mesas, gestionar el catálogo de productos y administrar el sistema de manera eficiente.  

---

## 👥 Integrantes del grupo
- **Palacios Mateo 🦈** → Frontend + Marketing/UI  
- **Cottier Juan 💀** → Backend + Documentación  

---

## 🎯 Objetivo del proyecto
Desarrollar un sistema web funcional con enfoque **end-to-end**, que simule un entorno real de trabajo en equipo dentro de una empresa, cumpliendo con los requisitos de autenticación, roles, marketing, documentación y despliegue.  

---

## 🔑 Funcionalidades principales

### 👤 Usuarios
- **Clientes/Invitados**  
  - Consultar información del restaurante.  
  - Ver el catálogo de productos.  
  - Reservar mesas ingresando datos básicos (nombre, teléfono, horario, etc.).  
  - No requieren registro ni login.   

- **SuperAdmin**
  - Acceso completo a todas las areas del sistema
  - Gestion de los usuario y permisos del sistema 

- **Admin de mesas**  
  - Encargado de gestionar el local
  - Ver la cantidad de personas asigandas a cada meza
  - Cantidad de mesas libres
  - Cantidad de mozos asignados 
  - Etc.

- **Admin de reservas**  
  - Encargados de administrar las reservas de las mezas 
  - Asignan los mozos a cada meza

- **Admin de Catalogo**
  - Gestion del catalogo del local  

- **Mozos**
  - Pueden ver a que meza estan asignados      

### 🔐 Autenticación
- No existe registro público.  
- Solo hay **login para usuarios internos** (administradores/superadmin).  
- Usuarios internos son creados y gestionados por el **SuperAdmin**.  

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **React (Vite)**  
- Axios/Fetch  
- CSS vanila 

### Backend
- **Node.js** 
- API REST con roles, autenticación (JWT o sessions) y validación  
- Base de datos relacional (**MySQL**)  

### Marketing/UI
- Estudio de color (3 paletas propuestas)  
- Tipografías primarias/secundarias  
- Logos en distintos formatos (PNG, monocromo/color)  
- Banners promocionales y mockups  

### Documentación
- Introducción, objetivo y alcance del sistema  
- Diccionario de datos  
- DER y modelo físico de la base de datos  
- Casos de uso y diagramas de secuencia  
- Diagrama de Gantt  
- Manual de instalación y despliegue  
- Capturas del sistema en funcionamiento  

---

## 📑 Documentación del proyecto
El proyecto incluye la siguiente documentación técnica:
1. Introducción, objetivos y alcance.  
2. Diccionario de datos (tablas, campos, PK/FK, descripción).  
3. DER (Diagrama Entidad-Relación).  
4. Modelo físico de la base de datos.  
5. Casos de uso principales (ej. autenticación, gestión de reservas, gestión de catálogo).  
6. Diagramas de secuencia para flujos críticos (ej. recuperar contraseña, asignación de roles).  
7. Diagrama de Gantt (fases: diseño, frontend, backend, integración DB, pruebas, documentación, presentación).  
8. Guía de instalación y despliegue.  
9. Evidencias (capturas, rutas clave, roles en acción).  
10. Anexo de maquetado de la página.  

---

## 🚀 Instalación y despliegue
1. Clonar este repositorio:  
   ```bash
   git clone https://github.com/usuario/restaurantspace.git

---

📝 Licencia

Este proyecto fue desarrollado en el marco de la materia:
Proyecto, Diseño e Implementación de Sistemas Computacionales 7.4 – Curso 7°2.
Docente: Gareis Pablo 🧙‍♂️.