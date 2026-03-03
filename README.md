# EventsProject — Backend

Sistema de gestión de eventos masivos desarrollado en Node.js con Express y PostgreSQL. Permite administrar eventos, categorías, usuarios y el registro de intereses y favoritos.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose
- [Thunder Client](https://www.thunderclient.com/) u otro cliente HTTP para pruebas

---

## Variables de entorno

Crea un archivo `.env` dentro de la carpeta `backend/` con las siguientes variables:

```env
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
DB_PORT
DB_HOSTs
```

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd EventsProject
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Levantar la base de datos

Desde la raíz del proyecto (`EventsProject/`):

```bash
docker compose up -d
```

Esto crea el contenedor de PostgreSQL, ejecuta `01_init.sql` (tablas) y `02_seed.sql` (datos de prueba) automáticamente.

Para verificar que las tablas se crearon correctamente:

```bash
docker exec -it eventdb psql -U uptcsftw -d eventtestdb -c "\dt"
```

### 4. Iniciar el servidor

```bash
cd backend
npm start
```

El servidor queda disponible en `http://localhost:3250`.

---

## Endpoints de la API

### Autenticación — `/auth`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Inicia sesión y devuelve un token JWT |

**Body:**
```json
{
  "email": "admin@eventos.com",
  "password": "123456"
}
```

---

### Usuarios — `/users`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/users/create` | Crea un nuevo usuario |
| GET | `/users/` | Lista todos los usuarios |
| GET | `/users/:id` | Obtiene un usuario por ID |
| PUT | `/users/update/:id` | Actualiza un usuario |

**Body para crear usuario:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@test.com",
  "password": "123456",
  "role": "Admin"
}
```
> El rol siempre se asigna como `Externo` al momento del registro, independientemente del valor enviado.

---

### Eventos — `/event`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/event/create` | Crea un nuevo evento |
| GET | `/event?page=1` | Lista eventos paginados (10 por página) |
| GET | `/event/:id` | Obtiene un evento por ID |
| PUT | `/event/update/:id` | Actualiza un evento |
| PATCH | `/event/disable/:id` | Desactiva un evento (soft delete) |
| PATCH | `/event/interested/:id` | Registra un clic de interés |
| GET | `/event/getAllInterested` | Lista todas las interacciones |
| POST | `/event/:id/favorite` | Marca un evento como favorito |
| DELETE | `/event/:id/favorite` | Desmarca un evento como favorito |
| GET | `/event/favorites/user/:userId` | Lista los favoritos de un usuario |
| GET | `/event/favorites/report` | Reporte de favoritos por evento |

**Body para favoritos:**
```json
{
  "userId": 1
}
```

---

### Categorías — `/category`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/category/create` | Crea una nueva categoría |
| GET | `/category/` | Lista todas las categorías activas |
| GET | `/category/:id` | Obtiene una categoría por ID |
| PUT | `/category/update/:id` | Actualiza una categoría |
| PATCH | `/category/disable/:id` | Desactiva una categoría (soft delete) |

---

## Notas adicionales

- Las contraseñas se almacenan hasheadas con **bcrypt**.
- La paginación de eventos es fija en **10 registros por página**.
- El soft delete en eventos y categorías usa el campo `status = false` en lugar de eliminar el registro.
- Para reiniciar la base de datos desde cero:

```bash
docker compose down
docker volume rm eventsproject_pgdata
docker compose up -d
```