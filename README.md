# Sistema de Usuarios, Roles y Citas (NestJS)

API NestJS con autenticación JWT, autorización basada en roles y persistencia en PostgreSQL usando TypeORM. Además de los módulos de usuarios y roles, ahora se incluye gestión de citas (`appointments`) donde cada usuario puede tener múltiples registros.

## Configuración rápida

1. Crea `.env` en la raíz con:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=postgres
   DB_NAME=parcial
   JWT_SECRET=<defínelo>
   JWT_EXPIRES_IN=120s
   PORT=3000
   ```
2. Instala dependencias y levanta el servidor:
   ```
   npm install --legacy-peer-deps
   npm run start:dev
   ```

## Migraciones SQL incluidas

| Script | Descripción |
| ------ | ----------- |
| `migrations/001_create_users_roles.sql` | Crea tablas `users`, `roles` y `users_roles`. |
| `migrations/002_create_appointments.sql` | Crea la tabla `appointments` con relación `user_id`. |
| `migrations/seed_users_roles.sql` | Inserta roles base (`admin`, `doctor`, `user`) y el usuario `admin@example.com` (`password123`). |

Aplica los archivos en orden (001 → 002 → seed) con `psql`, por ejemplo:
```
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_create_users_roles.sql
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/002_create_appointments.sql
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/seed_users_roles.sql
```

## Endpoints principales

- `POST /auth/register` – Registro público. Body: `{ email, password, name, phone?, roles?: [] }`.
- `POST /auth/login` – Login público. Body: `{ email, password }`. Devuelve `{ access_token }`.
- `POST /roles` y `GET /roles` – Solo admin.
- `PATCH /users/:id/roles`, `GET /users` – Solo admin.
- `GET /users/me` – Devuelve perfil autenticado.
- `POST /users/:userId/appointments` – Crear cita para un usuario (dueño o admin). Campos: `doctorId`, `scheduledAt` (ISO string), `status?`, `notes?`.
- `GET /users/:userId/appointments` – Lista citas de un usuario (dueño o admin).
- `GET /appointments/:id`, `PATCH /appointments/:id`, `DELETE /appointments/:id` – Solo dueño de la cita o admin.

Todas las rutas protegidas esperan `Authorization: Bearer <token>`. Las passwords se hashean con `bcryptjs` y no se retornan en respuestas.

## Pruebas

```
npm test
```

Usa Postman/Insomnia/curl para validar los flujos descritos (registro → login → operaciones según rol) usando el token JWT obtenido.
