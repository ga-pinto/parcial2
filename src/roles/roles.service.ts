import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    if (!dto.role_name?.trim()) {
      throw new BadRequestException('role_name es requerido');
    }
    const existing = await this.roleRepo.findOne({
      where: { role_name: dto.role_name },
    });
    if (existing) {
      throw new ConflictException('role_name ya existe');
    }
    const role = this.roleRepo.create(dto);
    const saved = await this.roleRepo.save(role);
    return { message: 'Rol creado con éxito', roleId: saved.id };
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepo.find();
    } catch (err) {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }

  async findByNames(names: string[]): Promise<Role[]> {
    if (!names || names.length === 0) {
      return [];
    }
    const roles = await this.roleRepo.find({
      where: names.map((name) => ({ role_name: name })),
    });
    return roles;
  }
}
