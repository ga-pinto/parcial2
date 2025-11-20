import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/entities/user.entity';
import { Role } from './src/entities/role.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Role],
  migrations: ['migrations/*.ts'],
  synchronize: false,
});
