import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { AssignRolesDto } from './dto/assign-roles.dto';

type SanitizedUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    phone?: string | null;
    roles?: Role[];
  }): Promise<SanitizedUser> {
    const existing = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictException('Email ya registrado');
    }
    const user = this.userRepo.create({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone ?? null,
      roles: data.roles ?? [],
    });
    const saved = await this.userRepo.save(user);
    return this.stripPassword(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.userRepo.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async assignRoles(userId: string, dto: AssignRolesDto) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const roles = await this.roleRepo.find({
      where: dto.roles.map((roleName) => ({ role_name: roleName })),
    });
    if (roles.length !== dto.roles.length) {
      throw new BadRequestException('roles inválidos');
    }
    user.roles = roles;
    await this.userRepo.save(user);
    return { message: 'Roles asignados' };
  }

  async me(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.stripPassword(user);
  }

  async findAll(): Promise<SanitizedUser[]> {
    const users = await this.userRepo.find({ relations: ['roles'] });
    return users.map((u) => this.stripPassword(u));
  }

  private stripPassword(user: User): SanitizedUser {
    const { password, ...rest } = user;
    return rest as SanitizedUser;
  }
}
