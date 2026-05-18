<div align="center">
  <img src="public/vvVantex.png" alt="Vantex Logo" width="200"/>

  # Vantex Backend
  
  ### API REST para sistema de gestión industrial y de maquinaria
  
  [![Node.js](https://img.shields.io/badge/Node.js-22.12+-green.svg)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-5.1.0-404D59.svg)](https://expressjs.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-3.16-4479A1.svg)](https://www.mysql.com/)
  [![Knex.js](https://img.shields.io/badge/Knex.js-3.1-E16222.svg)](https://knexjs.org/)
  [![JWT](https://img.shields.io/badge/JWT-JSON_Web_Tokens-000000.svg)](https://jwt.io/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
  
  <p align="center">
    <strong>Un backend robusto, seguro y escalable</strong> que expone los endpoints necesarios para administrar máquinas, órdenes de trabajo, inventario de repuestos y autenticación, construido sobre la arquitectura de Node.js y Express.
  </p>
</div>

---

## 📋 Descripción

**VantexCorp Backend** es la API RESTful central para el control integral de procesos industriales y de manufactura. Desarrollada con Node.js y Express, se encarga del procesamiento de datos, validación y almacenamiento seguro, operando sobre una base de datos relacional (MySQL).

El proyecto Implementa una arquitectura multicapa (Rutas, Controladores y Servicios), cuenta con un sistema de autenticación de alta seguridad basado en JSON Web Tokens (JWT) con encriptación de contraseñas, validación robusta de entrada de datos y recolección controlada de errores globales para una óptima trazabilidad industrial.

## ✨ Características

- 🔒 **Autenticación Segura (JWT)** - Login, registro, manejo de tokens y cifrado (`bcryptjs`).
- 🤖 **Gestión de Maquinaria** - Endpoints completos (CRUD) para monitoreo y administración de activos.
- 📋 **Órdenes de Trabajo** - Sistema dinámico para abrir, modificar y cerrar mantenimiento preventivo y reactivo.
- 📦 **Inventario de Repuestos** - Base de datos para los repuestos disponibles, consumo y stock en tiempo real.
- ✔️ **Validación de Datos** - Middleware de sanitización y validación utilizando `express-validator`.
- ⏱️ **Tareas de Cron** - Ejecuciones automatizadas en segundo plano (vía `node-cron`).
- 🏗️ **Arquitectura MVC Modificada** - Patrón claro con separación MVC (Controllers, Routes, Services).
- 🐳 **Docker Listo** - Incluye despliegue con `docker-compose.yml` para un arranque agnóstico al entorno.

## 🛠️ Tecnologías Utilizadas

- **[Node.js](https://nodejs.org/)** - Entorno de ejecución de tiempo de ejecución de JavaScript.
- **[Express](https://expressjs.com/)** - Framework web rápido, minimalista y flexible.
- **[MySQL2](https://www.npmjs.com/package/mysql2) & [Knex.js](https://knexjs.org/)** - Conexión nativa a DB SQL con constructor de consultas (Query Builder) optimizado.
- **[JSON Web Tokens](https://jwt.io/)** - Estándar abierto (RFC 7519) para transmisión segura de información de sesión.
- **[Express Validator](https://express-validator.github.io/docs/)** - Conjunto de middlewares para Express que valida los campos de los request.
- **[Jest](https://jestjs.io/)** - Entorno completo de Testing unitario en las rutas.

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js >= 22.12.x
- MySQL/MariaDB >= 10.x
- npm >= 10.x
- Docker (Opcional, pero recomendado)

### Variables de Entorno `.env`

Crea un archivo `.env` en la raíz con la configuración de la base de datos y JWT:

```env
PORT=8080
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=secret
DB_NAME=vantex_db
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h
```

## 🚀 Instalación Rápida

### 1. Clona el Repositorio

```bash
git clone https://github.com/tuusuario/Vantex-Backend.git
cd Vantex-Backend
```

### 2. Instala las Dependencias

```bash
npm install
```

### 3. Configura las Variables de Entorno

Asegúrate de haber creado el archivo `.env` como se detalló en los requisitos previos.

### 4. Inicializa la Base de Datos

```bash
# Si usas Docker (iniciará MariaDB en el puerto 3306 y cargará las rutinas SQL)
docker-compose up -d

# Si no usas Docker y tienes MySQL/MariaDB localmente, ejecuta en este orden:
mysql -u root -p < db/init.sql
mysql -u root -p < db/procedure.sql
mysql -u root -p < db/seed.sql
```

### 5. Inicia el Entorno de Desarrollo

```bash
# Modo desarrollo con recarga automática
npm run dev

# Modo normal (Producción)
npm start
```

✅ **La API estará escuchando en** `http://localhost:8080/`

---

## 🔐 Autenticación y Seguridad

El sistema está fuertemente protegido con el estándar de JWT (JSON Web Tokens).

### ¿Cómo consumir un endpoint protegido?
1. Realiza una petición de login o registro para obtener tu token.
2. Adjunta el token en las peticiones a través del `Header` HTTP `Authorization`:

```http
Authorization: Bearer <tu-access-token>
```

### Requisitos de contraseñas y Tokens

- Las contraseñas están hasheadas y salteadas utilizando `bcryptjs`.
- Se requiere que cuenten con cierto nivel de seguridad, estipulado en los middlewares validadores.
- Los tokens tienen un tiempo de expiración predefinido para mantener activas solo las sesiones genuinas.

## 👥 Roles de Usuario

El backend gestiona una jerarquía de permisos basada en tres roles globales:

- **admin:** Acceso total y destructivo. Puede eliminar máquinas, partes, cambiar roles de usuarios.
- **maintenance_manager:** Gestor. Puede crear y editar órdenes y máquinas pero no tiene accesos destructivos ni privilegios al 100%.
- **technician:** Operario técnico. Solo puede consultar máquinas y tomar acción en órdenes de trabajo ya asignadas.

## 🧑‍💻 Usuarios de Prueba (db/seed.sql)

Si inicializas la base de datos con nuestro archivo `seed.sql`, estos usuarios se crearán por defecto:

| Email | Contraseña | Rol | Nombre |
| :--- | :--- | :--- | :--- |
| **admin@vantexcorp.com** | `123456` | `admin` | Vantex Administrator |
| **manager@vantexcorp.com** | `123456` | `maintenance_manager` | Carlos (Maintenance Dir) |
| **pepe@vantexcorp.com** | `123456` | `technician` | Pepe (Senior Mechanic) |

> ⚠️ **Importante**: Las contraseñas base están inyectadas a código hash fijo bajo '123456' o similar en el `seed.sql`. Se deben cambiar en un ambiente Productivo.

---

## 📡 API Endpoints Principales

Aquí un resumen de los endpoints base soportados por Vantex. Para utilizar la colección de pruebas en Postman, puedes exportar `VantexCorp_API.postman_collection.json`.

### 🪪 Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Auth Requerido |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registrar a un nuevo miembro | No |
| `POST` | `/api/auth/login` | Loguea y retorna Token | No |
| `GET` | `/api/auth/me` | Obtener info de sesión actual | Sí |
| `GET` | `/api/auth/users` | Listado de empleados. | Sí (Admin/Manager) |
| `PUT` | `/api/auth/users/update/password` | Modificar contraseña | Sí |

### ⚙️ Máquinas (`/api/machines`)
| Método | Endpoint | Descripción | Auth Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/machines` | Consultar la lista y filtros | Sí |
| `GET` | `/api/machines/stats/all` | Estadísticas generales y KPI | Sí |
| `POST` | `/api/machines` | Agregar una nueva al taller | Sí (Admin/Manager) |

### 📋 Órdenes de Trabajo (`/api/work-orders`)
| Método | Endpoint | Descripción | Auth Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/work-orders` | Obtener matriz de tareas y asignaciones | Sí |
| `POST` | `/api/work-orders` | Crear nueva orden de inspección / rotura | Sí |
| `PUT` | `/api/work-orders/:id/start` | Marcar como trabajo de inicio en curso | Sí |
| `PUT` | `/api/work-orders/:id/close` | Cerrar una Orden consumiendo stock | Sí |

### 📦 Inventario de Repuestos (`/api/spare-parts`)
| Método | Endpoint | Descripción | Auth Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/spare-parts` | Trae catálogo de componentes y costo | Sí |
| `GET` | `/api/spare-parts/stock/low` | Alerta de re-compra para almacén | Sí |

---

## 🏗️ Uso Rápido y Scripts Disponibles

El proyecto incluye los siguientes scripts en `package.json`:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor usando Nodemon (recarga automática) integrando `.env`. |
| `npm start` | Inicia el servidor en modo normal (usado en Producción). |
| `npm test` | Ejecuta la suite de pruebas unitarias configuradas con Jest. |

## 📁 Estructura del Proyecto

```text
Vantex-Backend/
├── db/                     # Scripts de Base de Datos y Stored Procedures
│   ├── init.sql
│   ├── procedure.sql
│   └── seed.sql
├── src/
│   ├── app.js              # Punto de entrada de toda la app (Express, middlewares globales)
│   ├── config/             # Archivos de configuración general (ej: database.js)
│   ├── controllers/        # Controladores que manejan HTTP requests
│   ├── middlewares/        # Middlewares de Express (Auth, Error handlers)
│   ├── routes/             # Definición de Endpoints
│   ├── services/           # Lógica de negocio dura y acceso puro a la DB (Knex/SQL)
│   ├── utils/              # Funciones genéricas reutilizables (criptografía, cron, JWT)
│   └── validators/         # Esquemas de Express-Validator
├── docker-compose.yml      # orquestador de contenedores para DB y API
├── VantexCorp_API.postman_collection.json # Colección de endpoints para probar con Postman
└── package.json            # Instalaciones y scripts clave
```

## 🏗️ Arquitectura Multicapa

El backend de Vantex está modelado en una arquitectura de capas bien definidas:
1. **Ruta (`routes/`):** Define el endpoint (ej. `GET /api/machine`), aplica validadores (`validators/`) y el guardián de validación de tokens (`middlewares/`).
2. **Controlador (`controllers/`):** Recibe datos saneados, orquesta los `services` correspondientes y estructura el JSON de respuesta.
3. **Servicio (`services/`):** Almacena el *core business* y se conecta con la base de datos, retornando datos puros al controlador.

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Autores

<div align="center">
  <table align="center">
    <tr>
      <td align="center">
        <a href="https://github.com/Lorenzoo195">
          <img src="https://avatars.githubusercontent.com/u/214143437?v=4" width="100px; border-radius: 50%;" alt="Lorenzo"/><br />
          <sub><b>Lorenzo</b></sub>
        </a>
        <br />
        <p><strong>Full Stack Developer</strong></p>
      </td>
      <td align="center">
        <a href="https://github.com/Javiii3r">
          <img src="https://avatars.githubusercontent.com/u/232877625?v=4" width="100px; border-radius: 50%;" alt="Javi"/><br />
          <sub><b>Javier</b></sub>
        </a>
        <br />
        <p><strong>Full Stack Developer</strong></p>
      </td>
    </tr>
  </table>
</div>

## 🏆 Créditos y Agradecimientos

<div align="center">
  <p>Este proyecto fue desarrollado con dedicación por el equipo de VantexCorp Team.</p>
  
  **Desarrollado con ❤️ para llevar una eficiencia industrial óptima.**
</div>

---

<div align="center">
  
  [⬆ Volver al inicio](#-vantex-backend)
  
</div>