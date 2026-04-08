# EventsProject — Sistema de Gestión de Eventos

Sistema de gestión de eventos. Permite administrar eventos, categorías, tipos de tickets y usuarios, además de gestionar el proceso completo de compra de tickets y visualización de reportes.

El proyecto está dividido en dos partes principales:

- **Backend:** API REST desarrollada en Node.js con Express y PostgreSQL.
- **Frontend:** Single Page Application desarrollada en React con Vite.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose (para la base de datos)
- PGAdmin u otro cliente PostgreSQL (opcional)

---

## Backend

### Variables de entorno

Crea un archivo `.env` dentro de `backend/` con las siguientes variables:

```env
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=eventtestdb
DB_PORT=5432
DB_HOST=localhost
JWT_SECRET=tu_secreto_para_tokens
PORT=3250
```

### Ejecutar el backend

```bash
cd backend
npm install
npm start
```

El servidor quedará disponible en `http://localhost:3250`.

---

## Frontend

### Ejecutar el frontend

Abre una nueva terminal y desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

Vite levantará la interfaz, típicamente en `http://localhost:5173`.

---

## Endpoints de la API

> La mayoría de las rutas protegidas requieren el header `Authorization: Bearer <token>`.

### Autenticación y usuarios (`/auth`, `/users`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/login` | Iniciar sesión (email y password) |
| `POST` | `/users/create` | Registrar un nuevo usuario |
| `GET` | `/users/` | Listar todos los usuarios |

### Eventos (`/event`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/event?page=1` | Listar eventos (paginado) |
| `GET` | `/event/:id` | Detalle de un evento |
| `POST` | `/event/create` | Crear un evento (requiere permisos) |
| `PATCH` | `/event/interested/:id` | Registrar interés en un evento |
| `POST` | `/event/:id/favorite` | Marcar evento como favorito |
| `DELETE` | `/event/:id/favorite` | Desmarcar evento de favoritos |
| `GET` | `/event/favorites/user/:userId` | Listar eventos favoritos del usuario |

### Categorías (`/category`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/category/` | Listar todas las categorías |
| `POST` | `/category/create` | Crear una nueva categoría |

### Tipos de tickets (`/ticketType`, `/eventTicketType`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/ticketType/` | Listar tipos base (General, VIP, etc.) |
| `POST` | `/eventTicketType/` | Asignar tipos de tickets a un evento con precios y capacidades |

### Compras y tickets (`/purchase`, `/ticket`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/purchase/create` | Procesar la compra de tickets |
| `GET` | `/ticket/my-tickets` | Listar tickets del usuario autenticado |

### Dashboard (`/dashboard`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/dashboard/` | Métricas generales (ventas, eventos populares, etc.) |

---

## Estructura del proyecto

```
EventsProject/
├── docker-compose.yml
├── package.json
├── README.md
├── backend/
│   ├── index.js                  # Punto de entrada del servidor
│   ├── database.js
│   ├── constants/
│   │   └── role.js
│   ├── controllers/              # Lógica de cada ruta
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── dashboardController.js
│   │   ├── eventController.js
│   │   ├── eventTicketTypeController.js
│   │   ├── purchaseController.js
│   │   ├── ticketController.js
│   │   ├── ticketTypeController.js
│   │   └── userController.js
│   ├── cron/
│   │   └── eventCron.js          # Tareas programadas
│   ├── database/
│   │   ├── init.sql              # Creación de tablas
│   │   └── seed.sql              # Datos iniciales
│   ├── exceptions/
│   │   └── errors.js
│   ├── middlewares/
│   │   └── authMiddleware.js     # Verificación JWT
│   ├── models/                   # Acceso a datos (queries SQL)
│   ├── routes/                   # Definición de endpoints
│   ├── services/                 # Lógica de negocio
│   └── utils/
│       ├── bcrypt.js
│       └── jwt.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/           # Componentes reutilizables
        │   ├── EventForm/
        │   ├── FormField/
        │   ├── Modal/
        │   ├── Navbar/
        │   └── Spinner/
        ├── context/
        │   └── AuthContext.jsx   # Estado global de autenticación
        ├── pages/                # Vistas de la aplicación
        │   ├── CategoriesPage/
        │   ├── CheckoutPage/
        │   ├── DetailPage/
        │   ├── EventsPage/
        │   ├── FavoritesPage/
        │   ├── LoginPage/
        │   ├── MyTicketsPage/
        │   ├── ProfilePage/
        │   ├── RegisterPage/
        │   └── ReportPage/
        ├── services/             # Llamadas a la API
        │   ├── auth.service.js
        │   ├── categories.service.js
        │   ├── checkout.service.js
        │   ├── events.service.js
        │   ├── ticketTypes.service.js
        │   ├── users.service.js
        │   ├── config.js
        │   └── index.js
        └── styles/
            └── global.css
```

---

## Notas técnicas

- Las contraseñas se almacenan hasheadas con **bcrypt**.
- La autenticación utiliza **JSON Web Tokens (JWT)**.
- El modelo de datos usa *soft-deletes* (`status = false`) para evitar el borrado físico de registros.