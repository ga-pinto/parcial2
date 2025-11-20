import { randomUUID } from 'node:crypto';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  role_name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string | null;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  constructor() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
