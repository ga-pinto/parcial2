# Sistema de Usuarios y Roles (NestJS)

API NestJS con autenticación JWT, autorización por roles y persistencia en PostgreSQL usando TypeORM.

## Configuración

1) Variables de entorno (`.env`):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=parcial
JWT_SECRET=<cambia_esto>
JWT_EXPIRES_IN=120s
PORT=3000
```
2) Instalar dependencias y levantar el servidor:
```
npm install --legacy-peer-deps
npm run start:dev
```

## Migraciones SQL
- `migrations/001_create_users_roles.sql` crea tablas `users`, `roles` y tabla pivote `users_roles` (incluye `pgcrypto` para UUID).
- `migrations/seed_users_roles.sql` inserta roles base (`admin`, `doctor`, `user`) y un usuario admin (`admin@example.com` / `password123`).

Aplicar manualmente con psql, por ejemplo:
```
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_create_users_roles.sql
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/seed_users_roles.sql
```

## Endpoints principales
- `POST /auth/register` público. Body: `{ email, password, name, phone?, roles?: [] }`. Respuesta: `201 { message, userId }`.
- `POST /auth/login` público. Body: `{ email, password }`. Respuesta: `200 { access_token }`. Errores: 401 credenciales, 423 usuario desactivado.
- `POST /roles` admin. Crea rol. Errores: 400 `role_name es requerido`, 409 duplicado.
- `GET /roles` admin. Lista roles.
- `PATCH /users/:id/roles` admin. Body: `{ roles: ["admin","doctor"] }`. Respuesta: `200 { message: "Roles asignados" }`.
- `GET /users/me` autenticado. Devuelve perfil sin contraseña.
- `GET /users` admin. Lista usuarios con roles.

Tokens: Authorization `Bearer <jwt>`. Passwords hasheadas con `bcryptjs`. Validaciones con `class-validator`. Nunca se retorna el hash de contraseña.

## Ejecutar pruebas
```
npm test
```
