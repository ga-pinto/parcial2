INSERT INTO roles (role_name, description)
VALUES
  ('admin', 'Administrador'),
  ('user', 'Usuario')
ON CONFLICT (role_name) DO NOTHING;

-- hasheado  : password123
INSERT INTO users (email, password, name, phone, is_active)
VALUES (
  'admin@uniandes.com',
  '$2a$10$PkqC3ZUBxKgMlMdlE5F4Kedb9kegTXfC1jfCIUqNpFcGoqPuw7CRO',
  'Admin Inicial',
  '300-555-1234',
  true
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.role_name = 'admin'
WHERE u.email = 'admin@uniandes.com'
ON CONFLICT DO NOTHING;
